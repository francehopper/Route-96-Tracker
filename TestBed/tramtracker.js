var currentRow = 0;
var stopInfo = {};
var clearResults = true;
var currentTrackerID = 0;
var currentRouteFilter = 0;
var showProfiles = false;
var lowFloorFilter = false;
var results = [];
var messages = [];
var pageChanges = 0;
var currentMessage = 0;
var hasLoaded = false;

var pageTimer = false;
var refreshTimer = false;
var timeTimer = false;
var requestTime = false;
var timeDelta = 0;

document.observe('dom:loaded', function () { onload(); });

function onload ()
{
	// are we loaded into a frame? clear the background if so
	try
	{
		if (window != window.top)
			document.body.style.backgroundColor = '#ffffff';
	} catch (e)
	{
		document.body.style.backgroundColor = '#ffffff';
	}
	
	// get a guid first
	if (getCookie('guid') == '')
	{
		PidsService.getGuid(setGuid);
		return;
	}

	// get things like the tracker ID from the URL
	var params = document.location.search.toQueryParams();
	if (params.id) currentTrackerID = params.id;
	if (params.rt) currentRouteFilter = params.rt;
	if (document.location.search.match(/lf/)) lowFloorFilter = true;
	if (document.location.search.match(/tp/)) showProfiles = true;

	play();
}

function setGuid (guid)
{
	setCookie('guid', guid, 365);
	
	if (getCookie('guid') == '')
		alert('An error has occured. This application requires cookies to function, please ensure that you accept any cookies as required.');
	else
		onload();
}

function pause ()
{
	if (timeTimer) { timeTimer.stop(); timeTimer = false; }
	if (pageTimer) { pageTimer.stop(); pageTimer = false; }
	if (refreshTimer) { refreshTimer.stop(); refreshTimer = false; }
	showPaused();
}

function play ()
{
	pause();
	timeTimer = new PeriodicalExecuter(updateTimer, 1);
	updateTimer();
	pageTimer = new PeriodicalExecuter(updatePages, 4);
	updatePages();
	refreshTimer = new PeriodicalExecuter(populate, 15);
	populate();
}

function populate ()
{
	// show/hide the filters as appropriate
	if (currentRouteFilter != '0')
	{
		$('filterinfo').show();
		$('route_filter').update(currentRouteFilter).show();
	} else
		$('route_filter').hide();

	if (lowFloorFilter)
	{
		$('filterinfo').show();
		$('lowfloor_filter').show();
	} else
		$('lowfloor_filter').hide();
		
	if (currentRouteFilter == '0' && !lowFloorFilter)
		$('filterinfo').hide();
		
	if (!hasLoaded)
	{
		PidsService.getStopInformation(currentTrackerID, updateStopInformation);
		showLoading();
		clearResults = true;
		hasLoaded = true;
	}
	requestTime = new Date();
	PidsService.getNextPredictedRoutesCollection(currentTrackerID, currentRouteFilter, lowFloorFilter, displayResults);
}

function updateStopInformation (stop)
{
	if (stop.name.match(/&/))
	{
		stop.directionText = stop.name.replace(/^.*?&\s/, '') + (stop.directionText ? ' - ' + stop.directionText : '');
		stop.name = stop.name.replace(/\s&.*/, '');
	}
	stopInfo = stop;
	$('title').update(stopInfo.name ? stopInfo.name : '');
	$('subtitle').update(stopInfo.directionText ? stopInfo.directionText : '');
	$('trackerid').update(currentTrackerID);
	$('stopid').update(stopInfo.stopNumber ? stopInfo.stopNumber : '');
}

function displayResults (predictions)
{
	if ($('loading').visible())
		hideLoading();

	if (clearResults)
	{
		clear();
	}

	// calculate the time delta needed
	if (predictions.length > 0)
	{
		var serverTime = parseTime(predictions[0].requestTime);
		timeDelta = requestTime.getTime() - serverTime.getTime();
	}

	results = [];
	messages = [];
	var disruptions = [];
	var specialevents = [];
	predictions.each (function (prediction)
	{
		if (prediction.available)
			results.push({ route: prediction.headboardRouteNumber, destination: prediction.destination, lowfloor: prediction.lowFloor, disrupted: prediction.disrupted, aircon: prediction.aircon, arrival: prediction.arrival, specialevent: prediction.specialEventMessage, tramNumber: prediction.tramNumber });

		// is this route disrupted?
		if (prediction.disrupted && disruptions.indexOf(prediction.headboardRouteNumber) == -1)
			disruptions.push(prediction.headboardRouteNumber);
			
		// is there a special event message?
		if (!!prediction.specialEventMessage && prediction.specialEventMessage.length > 0 && specialevents.indexOf(prediction.specialEventMessage) == -1)
			specialevents.push(prediction.specialEventMessage);
	});

	// are there messages?
	if (disruptions.length > 1)
	{
		var last = disruptions.pop();
		var m = new Template('Routes #{routes} are currently disrupted and delays may occur.');
		messages.push({ type: 'disruption', content: m.evaluate({ routes: disruptions.join(', ') + ' and ' + last })});
	} else if (disruptions.length == 1)
	{
		messages.push({ type: 'disruption', content: 'Route ' + disruptions[0] + ' is currently disrupted and delays may occur.' });
	}
	
	// are there special event messages?
	if (specialevents.length > 0)
	{
		specialevents.each(function (e)
		{
			messages.push({ type: 'specialevent', content: e });
		});
	}
	
	pageChanges = 0;

	if (clearResults || $('time').match('.paused'))
	{
		showPlaying();
		currentRow = 0;
		updatePages();
		clearResults = false;
	}
}

function displayErrorMessage (message)
{
	if ($('specialevent').visible())
		new Effect.Fade($('specialevent'), { duration: 1 });
	if ($('disruption').visible())
		new Effect.Fade($('disruption'), { duration: 1 });
	
	if (!$('screencontainer').visible())
		$('screencontainer').show();

	clear();
	results = [];
	messages = [];
	//$('subtitle').update('An Error Has Occured');

	if ($('loading').visible())
		hideLoading();

	$('errormessage').update(message);
	if (!$('error').visible()) new Effect.Appear($('error'), { duration: 1 });
}

function displaySpecialEventMessage (message)
{
	if ($('loading').visible())
		hideLoading();

	$('specialeventmessage').update(message);
	if (!$('specialevent').visible()) new Effect.Appear($('specialevent'), { duration: 1 });
}

function displayDisruptionMessage (message)
{
	if ($('loading').visible())
		hideLoading();

	$('disruptionmessage').update(message);
	if (!$('disruption').visible()) new Effect.Appear($('disruption'), { duration: 1 });
}

function hasMessage ()
{
	return ($('specialevent').visible() || $('disruption').visible() || $('error').visible());
}

function hideMessage ()
{
	if ($('specialevent').visible())
		new Effect.Fade($('specialevent'), { duration: 1 });
	if ($('disruption').visible())
		new Effect.Fade($('disruption'), { duration: 1 });
	if ($('error').visible())
		new Effect.Fade($('error'), { duration: 1 });
}

function clear ()
{
	$('screen').select('tr.result td').each (function (cell) { if(!cell.match('.icons')) cell.update(); });
	$('screen').select('tr.result td.destination').each ( function (cell) { $w(cell.className).each ( function (c) { if (c != 'destination') cell.removeClassName(c); }); } );
	$('screen').select('td.icons img').invoke('hide');
}

var updatePages = function ()
{
	// is there a message displayed?
	if (hasMessage() && results && results.length > 0)
	{
		// hide it
		hideMessage();

	// no message displayed, check if we should display one
	} else if ((!clearResults || results.length == 0) && messages.length > 0)
	{
		// yep, display the next one
		if (currentMessage+1 > messages.length)
			currentMessage = 0;

		var message = messages[currentMessage];
		if (message.type == 'disruption')
			displayDisruptionMessage(message.content);
		else if (message.type == 'specialevent')
			displaySpecialEventMessage(message.content);
//		else
//			displayErrorMessage(message.content);
		return;
	}
	
	// reset back to the start if we've gone past the end
	if (currentRow >= results.length)
		currentRow = 0;

	// clear the existing data
	clear();
	
	// populate the next three rows
	$R(0, 2).each (function (i)
	{
		// if our new current row doesn't exist we need to stop populating details (leave remaining rows on the screen blank)
		if (!results[currentRow])
			return;

		// update the table row with the details
		var result = results[currentRow];
		var row = $('screen').down('tr', i);
		row.down('.route').update(result.route);
		row.down('.destination').update(result.destination);
		row.down('.mins').update(getTime(result.arrival));
		if (result.lowfloor) row.down('.lowfloor').show();
		if (result.disrupted) row.down('.disrupted').show();
		if (result.aircon) row.down('.aircon').show();
		if (result.specialevent) row.down('.specialevent').show();
		currentRow++;

		// is there a tram number?
		if (showProfiles && !!result.tramNumber)
		{
			var className = 'tram_class_' + getTramClass(result.tramNumber);
			if (className != 'tram_class_')
				row.down('.destination').addClassName(className);
		}
	});

	pageChanges++;
	if (pageChanges > 9 && $('time').match('.playing'))
		showWarning();
	else if (pageChanges > 31 && $('time').match('.warning'))
		showPaused();
		
};


function reversePopulateMenus ()
{
	// we know the Tracker ID, lets get the route details for it
	var trackerid = $F('stopid_input');
	
	if (!trackerid || trackerid == '')
	{
		$('route_select').update(new Element('option', { value: '' }).update('Select Route'));
		$('stop_select').update(new Element('option', { value: '' }).update('Select Route'));
		return;
	}

	// get all the routes through this stop
	PidsService.getMainRoutesForStop(trackerid, reversePopulateMenusWithRoutes);
}

function reversePopulateMenusWithRoutes (routes)
{
	// setup the filter
	$('route_filter_select').update(new Element('option', { value: '0' }).update('All'));
	routes.each (function (r)
	{
		var opt = new Element('option', { value: r }).update('Route ' + r);
		if (r == currentRouteFilter)
			opt.writeAttribute('selected', 'selected');
		$('route_filter_select').insert(opt);
	});

	// go with the first route, get all the stops in the up direction
	var route = routes[0];
	PidsService.getListOfStopsByRouteNoAndDirection(route, 1, function (stops) { reversePopulateMenusWithUpStops(stops, route); });
}

function reversePopulateMenusWithUpStops (stops, route)
{
	// loop over the stops, check to see if our tracker id is in that list
	if (!stops.any( function (stop)
	{
		if (stop.trackerID == $F('stopid_input'))
		{
			populateStopsWithData(stops);
			$('route_select').value = route + '_up';
			return true;
		}
		
		// not found, keep looping
		return false;
	}))
	{
		// not found going up, try down
		PidsService.getListOfStopsByRouteNoAndDirection(route, 0, function (stops) { reversePopulateMenusWithDownStops(stops, route); });
	}
}

function reversePopulateMenusWithDownStops (stops, route)
{
	// loop over the stops, check to see if our tracker id is in that list
	if (!stops.any( function (stop)
	{
		if (stop.trackerID == $F('stopid_input'))
		{
			populateStopsWithData(stops);
			$('route_select').value = route + '_down';
			return true;
		}
		
		// not found, keep looping
		return false;
	}))
	{
		// not found in the down direction either, blank the select item
		$('stop_select').update(new Element('option', { label: '' }).update('No stops found for route'));
	}
}


var updateTimer = function ()
{
	if (!$('time')) return;

	var date = new Date();
	var meridian = date.getHours() >= 12 ? 'PM' : 'AM';
	var delimiter = ':';
	$('time').update
	( 
		(date.getHours() > 12 ? date.getHours()-12 : date.getHours()) + delimiter +
		(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + delimiter +
		(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + ' ' + meridian
	);
};

function flip ()
{
	if (window.widget) {
		widget.prepareForTransition("ToBack");
 	}

	$('front').hide();
	$('back').show();

    if (window.widget){
		(function () { widget.performTransition(); }).defer();
		widget.setCloseBoxOffset(15,15);
    }

	if ($('stop_select').descendants().length <= 1 && $F('stopid_input') != '')
		reversePopulateMenus();
}

function done ()
{
	// get the stop, if exists
	if (window.widget)
	{
		widget.setPreferenceForKey($('stopid_input').value, widget.identifier + '_trackerid');
		widget.setPreferenceForKey($F('route_filter_select'), widget.identifier + '_route');
		widget.setPreferenceForKey($F('lowfloor_select'), widget.identifier + '_lowfloor');

		widget.prepareForTransition('ToFront');
	}	
	$('front').show();
	$('back').hide();

    if (window.widget){
		(function () { widget.performTransition(); }).defer();
		widget.setCloseBoxOffset(15,15);
    }

	populate();
	return false;
}

function showLoading()
{
	hideMessage();
	$('screencontainer').hide();
	$('loading').show();
	$('title').update('tramTRACKER');
	$('subtitle').update('Loading, please wait...');
	$('stopid').update();
	$('trackerid').update();
}

function hideLoading()
{
	$('screencontainer').show();
	$('loading').hide();
}

function showPaused ()
{
	$('time').removeClassName('paused').removeClassName('playing').removeClassName('warning');
	$('time').addClassName('paused');
}

function showPlaying ()
{
	$('time').removeClassName('paused').removeClassName('playing').removeClassName('warning');
	$('time').addClassName('playing');	
}

function showWarning ()
{
	$('time').removeClassName('paused').removeClassName('playing').removeClassName('warning');
	$('time').addClassName('warning');	
}

function parseTime (timestr)
{
    timestr = timestr.split('+')[0].split('T');
    var date = timestr.shift().split('-');
    var t = timestr.shift().split(':');

	// if its the year 9999 then tramtracker is unavailable for that stop/route
	if (date[0] == 9999)
		return false;

	var time = new Date();
	time.setFullYear(date[0], date[1]-1, date[2]);
    time.setHours(timestr[0] == 'PM' && t[0] != 12 ? Number(t[0])+12 : t[0], t[1], t[2]);
	return time;
}

function getTime (timestr) {
	var time = parseTime(timestr);
	if (!time) return '-';

	var now = new Date();
	now.setTime(now.getTime() - timeDelta);
	var diff = Math.floor((time - now) / 1000);

	if (diff < -60)
		return '-';
	else if (diff <= 60)
		return 'now';
	else if (diff < 120)
		return '1';
	else if (diff > 3600)
	{
		var m = time.getHours() > 12 ? 'PM' : 'AM';
		var hours = time.getHours();
		var minutes = time.getMinutes();

		if (minutes < 10) minutes = '0' + minutes;
		if (hours > 12) hours = hours - 12;
		
		var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

		if (time.getFullYear() != now.getFullYear() || time.getMonth() != now.getMonth() || time.getDate() != now.getDate())
			return days[time.getDay()] + ' ' + time.getHours() + ':' + minutes;
		else
			return hours + ':' + minutes + ' ' + m;
	}
	else
		return Math.floor(diff / 60);
}

function getTramClass (tramNumber)
{
	// zeros are unknown
	if (tramNumber <= 0)
		return false;

	// Z1 class trams
	if (tramNumber >= 1 && tramNumber <= 100)
		return "z1";

	// Z2 class trams
	else if (tramNumber <= 115)
		return "z2";
	
	// Z3 class trams
	else if (tramNumber <= 230)
		return "z3";
	
	// A1 class trams
	else if (tramNumber <= 258)
		return "a1";

	// A2 class trams
	else if (tramNumber <= 300)
		return "a2";
	
	// W Class trams
	else if (tramNumber >= 681 && tramNumber <= 1040)
		return "w";
	
	// B1 class trams
	else if (tramNumber == 2001 || tramNumber == 2002)
		return "b1";
	
	// B2 Class Trams
	else if (tramNumber >= 2003 && tramNumber <= 2132)
		return "b2";
	
	// C Class Trams
	else if (tramNumber >= 3001 && tramNumber <= 3036)
		return "c";
	
	// D1 Class trams
	else if (tramNumber >= 3501 && tramNumber <= 3600)
		return "d1";
	
	// D2 Class trams
	else if (tramNumber >= 5001 && tramNumber <= 5100)
		return "d2";
	
	// Bumblebee trams
	else if (tramNumber >= 5101 && tramNumber <= 5200)
		return "c2";

	// E-Class trams
	else if (tramNumber >= 6001 && tramNumber <= 6050)
		return "e";
	
	// bleh, return the default
	return false;
}
