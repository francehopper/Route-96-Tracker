function getText (element)
{
	// try several ways to get the text of an element
	return Try.these(
		function () { return element.textContent || element.text; }
	) || '';
}

var PidsService =
{
	//url: 'http://ws.tramtracker.com.au/pidsservice/pids.asmx',
	url: 'http://fhnwrk.com/TramTracker/sandbox',
	//url: '/pidsservice/pids.asmx',
	routeList: [],
	totalRoutes: 0,
	routeCallback: null,

	/**
	 * Set the authorisation header
	**/
	setHeader: function ()
	{
		SOAPClient.addHeader('PidsClientHeader',
		{
			ClientGuid: getCookie('guid') != '' ? getCookie('guid') : '00000000-0000-0000-0000-000000000001',
			ClientType: 'WEBPID',
			ClientVersion: '1.1.0',
			ClientWebServiceVersion: '6.4.0.0'
		});
	},
	
	/**
	 * Get a GUID from the server
	**/
	getGuid: function (callback)
	{
		SOAPClient.invoke(this.url, 'GetNewClientGuid', new SOAPClientParameters(), true, function (r, sr, cb) { PidsService.parseGuid(r, sr, callback); });
	},
	
	/**
	 * Parse the Guid from the server4
	**/
	parseGuid: function (result, response, callback)
	{
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "GetNewClientGuidResult").length > 0)
			return callback(getText(SOAPClient._getElementsByTagName(response.responseXML, "GetNewClientGuidResult")[0]));

		alert('An unknown error has occured, please try again later.');
	},

	/**
	 * Get all non-sub routes and their destination names
	**/
	getListOfNonSubRoutes: function (callback)
	{
		return this.getNonSubRoutes(callback);
	},

	/**
	 * Get all the Routes that run through a stop
	**/
	getAllRoutesForStop: function (stop, callback)
	{
		var params = new SOAPClientParameters();
		params.add('stopNo', stop);
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetAllRoutesForStop', params, true, function (r, sr, cb) { PidsService.parseAllRoutesForStops(r, sr, callback); });
	},
	
	
	/**
	 * Process the routes
	**/
	parseAllRoutesForStops: function (result, response, callback)
	{
		if(result && response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "RouteNo"))
		{
			var routes = [];
			var routexml = SOAPClient._getElementsByTagName(response.responseXML, "RouteNo");
			if (routexml.length == 0)
			{
				alert('No routes could be found at the specified stop, please try again later.');
				return;
			}
			for (var i = 0; i < routexml.length; i++)
				routes.push(getText(routexml[i]));
			return callback(routes);
		}
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "validationResult").length > 0)
			alert(getText(SOAPClient._getElementsByTagName(response.responseXML, "validationResult")[0]).replace(/\[.*?\]/, ''));
		else
			alert("An unknown error has occured, please try again later.");
	},
	
	/**
	 * Get a list of all main routes and their destinations
	**/
	getDestinationsForAllRoutes: function (callback)
	{
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetDestinationsForAllRoutes', new SOAPClientParameters(), true, function (r ,sr, cb) { PidsService.parseDestinationsForAllRoutes(r, sr, callback); });
	},
	
	/**
	 * Process the list
	**/
	parseDestinationsForAllRoutes: function (result, response, callback)
	{
		if (!response || !response.responseXML)
		{
			alert('Unable to obtain a list of available routes, please try again later.');
			return;
		}
		
		var x = SOAPClient._getElementsByTagName(response.responseXML, 'ListOfDestinationsForAllRoutes');
		var routes = [];
		var currentRoute = {};
		$A(x).each(function (r)
		{
			currentRoute.route = getText(SOAPClient._getElementsByTagName(r, 'RouteNo')[0]);
			if (getText(SOAPClient._getElementsByTagName(r, 'UpStop')[0]) == 'true')
				currentRoute.up = getText(SOAPClient._getElementsByTagName(r, 'Destination')[0]);
			else
				currentRoute.down = getText(SOAPClient._getElementsByTagName(r, 'Destination')[0]);

			// got both directions?
			if (currentRoute.up && currentRoute.down)
			{
				routes.push(currentRoute);
				currentRoute = {};
			}
		});
		
		// push it through to the callback
		callback(routes);
	},
	
	/**
	 * Get a List of non-sub routes
	**/
	getMainRoutes: function (callback)
	{
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetMainRoutes', new SOAPClientParameters(), true, function (r, sr, cb) { PidsService.parseMainRoutes(r, sr, callback); });
	},
	
	/**
	 * Process the list of routes
	**/
	parseMainRoutes: function (result, response, callback)
	{
		if (!response || !response.responseXML)
		{
			alert('Unable to obtain a list of available routes, please try again later');
			return;
		}

		var x = SOAPClient._getElementsByTagName(response.responseXML, 'RouteNo');
		if (!x || !x.length)
		{
			alert('Unable to obtain list of available routes, please try again later.');
			return;
		}

		// fire off a request for the up/down destinations for each route
		PidsService.totalRoutes = x.length;
		PidsService.routeCallback = callback;
		$A(x).each (function (route)
		{
			PidsService.getDestinationsForRoute(getText(route), PidsService.wrapMainRoutes);
			return true;
		});
	},
	
	/**
	 * Wrapper around the callback for the Get Destinations call
	**/
	wrapMainRoutes: function (route, up, down)
	{
		// add it to our list
		PidsService.routeList.push({ route: route, up: 'To ' + up, down: 'To ' + down });

		// have we reached our quota?
		if (PidsService.routeList.length >= PidsService.totalRoutes)
		{
			// sort by route before calling the callback
			PidsService.routeCallback(PidsService.routeList.sortBy(function (r) { return r.route; }));
			PidsService.routeList = [];
			PidsService.totalRoutes = 0;
			PidsService.routeCallback = null;
		}
	},

	/**
	 * Get the up and down destinations for the specified route
	**/
	getDestinationsForRoute: function (route, callback)
	{
		var params = new SOAPClientParameters();
		params.add('routeNo', route);
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetDestinationsForRoute', params, true, function (r, sr, cb) { PidsService.parseDestinationsForRoute(r, sr, callback, route); });
	},

	/**
	 * Process the routes
	**/
	parseDestinationsForRoute: function (result, response, callback, route)
	{
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, 'RouteDestinations').length > 0)
		{
			callback(route, getText(SOAPClient._getElementsByTagName(response.responseXML, 'UpDestination')[0]), getText(SOAPClient._getElementsByTagName(response.responseXML, 'DownDestination')[0]));
			return true;
		}

		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "validationResult").length > 0)
			alert(getText(SOAPClient._getElementsByTagName(response.responseXML, "validationResult")[0]).replace(/\[.*?\]/, ''));
		else
			alert("An unknown error has occured, please try again later.");
	},
	
	
	/**
	 * Get list of stops given a route no. and destination. The list excludes the last stop
	**/
	getListOfStopsByRouteNoAndDirection: function (route, up, callback)
	{
		var params = new SOAPClientParameters();
		params.add('routeNo', route);
		params.add('isUpDirection', up);
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetListOfStopsByRouteNoAndDirection', params, true, function (r, sr, cb) { PidsService.parseListOfStopsByRouteNoAndDirection(r, sr, callback); });
	},

	/**
	 * Process the routes
	**/
	parseListOfStopsByRouteNoAndDirection: function (result, response, callback)
	{
		if (result && result['diffgr:diffgram'].DocumentElement.S)
		{
			var stopsxml = SOAPClient._getElementsByTagName(response.responseXML, "S");
			if (stopsxml.length == 0)
			{
				alert('No stops could be found for the selected route, please try again later.');
			}
			var stops = [];
			for (var i = 0; i < stopsxml.length; i++)
			{
				if (getText(SOAPClient._getElementsByTagName(stopsxml[i], "TID")[0]) == '0')
					continue;

				stops.push(
				{
					name: getText(SOAPClient._getElementsByTagName(stopsxml[i], "Description")[0]),
					latitude: getText(SOAPClient._getElementsByTagName(stopsxml[i], "Latitude")[0]),
					longitude: getText(SOAPClient._getElementsByTagName(stopsxml[i], "Longitude")[0]),
					stopNumber: getText(SOAPClient._getElementsByTagName(stopsxml[i], "Name")[0]).replace(/[^0-9]+/, ''),
					suburb: getText(SOAPClient._getElementsByTagName(stopsxml[i], "SuburbName")[0]),
					trackerID: getText(SOAPClient._getElementsByTagName(stopsxml[i], "TID")[0])
					
				});
			}
			return callback(stops);
		}
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "validationResult").length > 0)
			alert(getText(SOAPClient._getElementsByTagName(response.responseXML, "validationResult")[0]).replace(/\[.*?\]/, ''));
		else
			alert("An unknown error has occured, please try again later.");
	},
	
	/**
	 * Get the data collection of ALL routes for a given stop no.
	**/
	getNextPredictedAllRoutesCollection: function (stop, callback)
	{
		var params = new SOAPClientParameters();
		params.add('stopNo', stop);
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetNextPredictedAllRoutesCollection', params, true, function (r, sr, cb) { PidsService.parseNextPredictedAllRoutesCollection(r, sr, callback); });
	},
	
	/**
	 * Process the routes
	**/
	parseNextPredictedAllRoutesCollection: function (result, response, callback)
	{
		if (result && response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "TemplateCollection"))
		{
			var predicted = SOAPClient._getElementsByTagName(response.responseXML, "TemplateCollection");
			if (predicted.length == 0)
			{
				return;
			}
			var departures = [];
			for (var i = 0; i < predicted.length; i++)
			{
				if (getText(SOAPClient._getElementsByTagName(predicted[i], "Destination")[0]) == "") continue;
				departures.push(
				{
					destination: getText(SOAPClient._getElementsByTagName(predicted[i], "Destination")[0]),
					headboardRouteNumber: getText(SOAPClient._getElementsByTagName(predicted[i], "HeadboardRouteNo")[0]),
					lowFloor: (getText(SOAPClient._getElementsByTagName(predicted[i], "IsLowFloorTram")[0]) == 'true'),
					arrival: getText(SOAPClient._getElementsByTagName(predicted[i], "PredictedArrivalDateTime")[0]),
					requestTime: getText(SOAPClient._getElementsByTagName(predicted[i], "RequestDateTime")[0]),
					routeNumber: getText(SOAPClient._getElementsByTagName(predicted[i], "RouteNo")[0])
				});
			}
			return callback(departures);
		}
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "validationResult").length > 0)
			alert(getText(SOAPClient._getElementsByTagName(response.responseXML, "validationResult")[0]).replace(/\[.*?\]/, ''));
	},
	
	/**
	 * Get the data collection of all parent routes ONLY for a given stop no
	**/
	getNextPredictedRoutesCollection: function (stop, route, lowfloor, callback)
	{
		var params = new SOAPClientParameters();
		params.add('stopNo', stop);
		params.add('routeNo', route);
		params.add('lowFloor', lowfloor ? 'true' : 'false');
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetNextPredictedRoutesCollection', params, true, function (r, sr, cb) { PidsService.parseNextPredictedRoutesCollection(r, sr, callback); });
	},
	
	/**
	 * Process the routes
	**/
	parseNextPredictedRoutesCollection: function (result, response, callback)
	{
		if (result && response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "ToReturn"))
		{
			var predicted = SOAPClient._getElementsByTagName(response.responseXML, "ToReturn");
			if (predicted.length == 0)
			{
				return;
			}
			var departures = [];
			for (var i = 0; i < predicted.length; i++)
			{
				departures.push(
				{
					destination: getText(SOAPClient._getElementsByTagName(predicted[i], "Destination")[0]),
					headboardRouteNumber: getText(SOAPClient._getElementsByTagName(predicted[i], "HeadboardRouteNo")[0]),
					lowFloor: (getText(SOAPClient._getElementsByTagName(predicted[i], "IsLowFloorTram")[0]) == 'true'),
					arrival: getText(SOAPClient._getElementsByTagName(predicted[i], "PredictedArrivalDateTime")[0]),
					requestTime: getText(SOAPClient._getElementsByTagName(predicted[i], "RequestDateTime")[0]),
					available: SOAPClient._getElementsByTagName(predicted[i], 'IsTTAvailable').length > 0 ? (getText(SOAPClient._getElementsByTagName(predicted[i], 'IsTTAvailable')[0]) == 'true') : false,
					specialEventMessage: SOAPClient._getElementsByTagName(predicted[i], 'SpecialEventMessage').length > 0 ? getText(SOAPClient._getElementsByTagName(predicted[i], 'SpecialEventMessage')[0]) : false,
					tramNumber: SOAPClient._getElementsByTagName(predicted[i], 'VehicleNo').length > 0 ? getText(SOAPClient._getElementsByTagName(predicted[i], 'VehicleNo')[0]) : false,
					disrupted: SOAPClient._getElementsByTagName(predicted[i], 'HasDisruption').length > 0 ? (getText(SOAPClient._getElementsByTagName(predicted[i], 'HasDisruption')[0]) == 'true') : false,
					aircon: SOAPClient._getElementsByTagName(predicted[i], 'DisplayAC').length > 0 ? (getText(SOAPClient._getElementsByTagName(predicted[i], 'DisplayAC')[0]) == 'true') : false
				});
			}
			return callback(departures);
		}
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "validationResult").length > 0)
		{
			displayErrorMessage(getText(SOAPClient._getElementsByTagName(response.responseXML, "validationResult")[0]).replace(/\[.*?\]/, ''));
		}
	},
	
	/**
	 * Get non sub routes running on a given tracker stop id.
	**/
	getMainRoutesForStop: function (stop, callback)
	{
		var params = new SOAPClientParameters();
		params.add('stopNo', stop);
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetMainRoutesForStop', params, true, function (r, sr, cb) { PidsService.parseMainRoutesForStop(r, sr, callback); });
	},

	/**
	 * Process the routes
	**/
	parseMainRoutesForStop: function (result, response, callback)
	{
		if (!response || !response.responseXML)
			return;

		// find the list of stops
		var x = SOAPClient._getElementsByTagName(response.responseXML, 'RouteNo');
		var routes = [];
		$A(x).each(function (r) { routes.push(getText(r)); });
		callback(routes);
	},
	
	/**
	 * Get the stop number on the flag and the names of street intersection as stop name. 
	**/
	getStopInformation: function (stop, callback)
	{
		var params = new SOAPClientParameters();
		params.add('stopNo', stop);
		this.setHeader();
		SOAPClient.invoke(this.url, 'GetStopInformation', params, true, function (r, sr, cb) { PidsService.parseStopInformation(r, sr, callback); });
	},

	/**
	 * Process the routes
	**/
	parseStopInformation: function (result, response, callback)
	{
		if (result && result['diffgr:diffgram'] && result['diffgr:diffgram'].DocumentElement && result['diffgr:diffgram'].DocumentElement.StopInformation)
		{
			var stopinfo = result['diffgr:diffgram'].DocumentElement.StopInformation;
			return callback({ stopNumber: stopinfo.FlagStopNo, directionText: stopinfo.CityDirection, name: stopinfo.StopName });			
		}
		if (response.responseXML && SOAPClient._getElementsByTagName(response.responseXML, "validationResult").length > 0)
			alert(getText(SOAPClient._getElementsByTagName(response.responseXML, "validationResult")[0]).replace(/\[.*?\]/, ''));
		else
			alert("An unknown error has occured, please try again later.");
	}
	
};

function setCookie(c_name,value,expiredays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function getCookie(c_name)
{
	// override for embedded systems, let the user specify their own GUID
	var params = document.location.search.toQueryParams();
	if (params.guid)
		return params.guid;
	
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}