


<html>

    <head><link rel="alternate" type="text/xml" href="/pidsservice/pids.asmx?disco" />

    <style type="text/css">
    
		BODY { color: #000000; background-color: white; font-family: Verdana; margin-left: 0px; margin-top: 0px; }
		#content { margin-left: 30px; font-size: .70em; padding-bottom: 2em; }
		A:link { color: #336699; font-weight: bold; text-decoration: underline; }
		A:visited { color: #6699cc; font-weight: bold; text-decoration: underline; }
		A:active { color: #336699; font-weight: bold; text-decoration: underline; }
		A:hover { color: cc3300; font-weight: bold; text-decoration: underline; }
		P { color: #000000; margin-top: 0px; margin-bottom: 12px; font-family: Verdana; }
		pre { background-color: #e5e5cc; padding: 5px; font-family: Courier New; font-size: x-small; margin-top: -5px; border: 1px #f0f0e0 solid; }
		td { color: #000000; font-family: Verdana; font-size: .7em; }
		h2 { font-size: 1.5em; font-weight: bold; margin-top: 25px; margin-bottom: 10px; border-top: 1px solid #003366; margin-left: -15px; color: #003366; }
		h3 { font-size: 1.1em; color: #000000; margin-left: -15px; margin-top: 10px; margin-bottom: 10px; }
		ul { margin-top: 10px; margin-left: 20px; }
		ol { margin-top: 10px; margin-left: 20px; }
		li { margin-top: 10px; color: #000000; }
		font.value { color: darkblue; font: bold; }
		font.key { color: darkgreen; font: bold; }
		font.error { color: darkred; font: bold; }
		.heading1 { color: #ffffff; font-family: Tahoma; font-size: 26px; font-weight: normal; background-color: #003366; margin-top: 0px; margin-bottom: 0px; margin-left: -30px; padding-top: 10px; padding-bottom: 3px; padding-left: 15px; width: 105%; }
		.button { background-color: #dcdcdc; font-family: Verdana; font-size: 1em; border-top: #cccccc 1px solid; border-bottom: #666666 1px solid; border-left: #cccccc 1px solid; border-right: #666666 1px solid; }
		.frmheader { color: #000000; background: #dcdcdc; font-family: Verdana; font-size: .7em; font-weight: normal; border-bottom: 1px solid #dcdcdc; padding-top: 2px; padding-bottom: 2px; }
		.frmtext { font-family: Verdana; font-size: .7em; margin-top: 8px; margin-bottom: 0px; margin-left: 32px; }
		.frmInput { font-family: Verdana; font-size: 1em; }
		.intro { margin-left: -15px; }
           
    </style>

    <title>
	tramTRACKER PIDS Web Service Web Service
</title></head>

  <body>

    <div id="content">

      <p class="heading1">tramTRACKER PIDS Web Service</p><br>

      <span>
          <p class="intro"><table style='width:80%;' cellpadding='10'><tr><td><img alt='tramTRACKER&reg' src='./images/tramTRACKER.jpg' /></td><td><p>tramTRACKER<sup>&reg</sup> PIDS Web Service is a public Web Service that provides a set of Web Methods to request real-time and scheduled tram arrival times, as well as stops and routes information.</p><p>By using this Web Service, you accept and agree to be bound by the tramTRACKER<sup>&reg</sup> PIDS Web Service terms & conditions. The latest copy of the terms and conditions can be found <a href='Terms.aspx'>here</a>.</p><p>You can keep yourself informed on the latest changes to the service by subscribing to our RSS feeds <a href='updates.xml'>here</a>.</p></td></tr><tr><td colspan='2'><b>How to Use</b><br /><p>Each Web method call requires a valid SOAP Header to be included in the SOAP Message.Otherwise, the request will be denied.</p>A SOAP Header consists of the following information:<br /><table style='width: 100%;' cellpadding='4'><tr><td style='width: 20%; font-weight: bold;'>ClientGuid</td><td style='width: 80%;'>Each instance of a client application needs a unique GUID.</td></tr><tr><td style='width: 20%; font-weight: bold;'>ClientType</td><td style='width: 80%;'>The client application type. If you are developing an application and would like adedicated client type, please send your request to:<br />feedback<img src='./images/sign.gif' />yarratrams.com.au.</td></tr><tr><td style='width: 20%; font-weight: bold;'>ClientVersion</td><td style='width: 80%;'>The version of the client application. The version format has to match the following regular expression: <br/>"<i>^(\d{1,3})(\.\d{1,3})?(\.\d{1,3})?(\.\d{1,5})?$</i>".<br/><br/> For example, 1.0, 1.0.0 or 1.0.0.0 </td></tr><tr><td style='width: 20%; font-weight: bold;'>ClientWebServiceVersion</td><td style='width: 80%;'>The current Web Service version that the client application is connecting to. The version format has to match the following expression: <br/>"<i>^(\d{1,3}\.)(\d{1,3}\.)(\d{1,3}\.)(\d{1,5})$</i>". <br/><br/>For example: 1.0.0.0<br/><br />The current Web Service version is 6.4.0.0</td></tr></table></td></tr></table><br /><br /></p>
      </span>

      <span>

          <p class="intro">The following operations are supported.  For a formal definition, please review the <a href="pids.asmx?WSDL">Service Description</a>. </p>
          
          
              <ul>
            
              <li>
                <a href="pids.asmx?op=GetDestinationsForAllRoutes">GetDestinationsForAllRoutes</a>
                
                <span>
                  <br>Returns a list of destinations for all routes in the network.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetDestinationsForRoute">GetDestinationsForRoute</a>
                
                <span>
                  <br>Returns destinations of both travel directions for the route specified.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>routeNo</td><td style='width: 85%;'>Type: string. Specify the route number to filter the results to a particular route number, or specify <i>0</i> (zero) to retrieve results for all routes that pass the stop. A route number is 1 to 3-digit followed by 0 or 1 alphabet.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetListOfStopsByRouteNoAndDirection">GetListOfStopsByRouteNoAndDirection</a>
                
                <span>
                  <br>Returns a list of stop information for the specified route and direction of travel. To determine the Up and Down direction of travel for a route, use the GetDestinationsForRoute method.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>routeNo</td><td style='width: 85%;'>Type: string. Specify the route number to filter the results to a particular route number, or specify <i>0</i> (zero) to retrieve results for all routes that pass the stop. A route number is 1 to 3-digit followed by 0 or 1 alphabet.</td></tr><tr><td style='font-weight: bold;'>isUpDirection</td><td style='width: 85%;'>Type: boolean. The GetDestinationsForAllRoutes and GetDestinationsForRoute methods can be used to obtain the Up/Down direction information.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetMainRoutes">GetMainRoutes</a>
                
                <span>
                  <br>Returns a list of all main routes in the network.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetMainRoutesForStop">GetMainRoutesForStop</a>
                
                <span>
                  <br>Returns a list of main routes that pass the specified Tracker Stop ID.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>stopNo</td><td style='width: 85%;'>Type: short. The 4-digit Tracker ID of the stop.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetNewClientGuid">GetNewClientGuid</a>
                
                <span>
                  <br>Returns a new Globally Unique Identifier (GUID) for the client application. This GUID is used in conjunction with the PIDS Client Header, which must be supplied for the Web Method call to be successful.<br/><br/><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetNextPredictedArrivalTimeAtStopsForTramNo">GetNextPredictedArrivalTimeAtStopsForTramNo</a>
                
                <span>
                  <br>Returns: - the tram trip information (such as route number and direction) - the predicted arrival times at each stop that will be passed by the tram as it is making its way to its destination. The predicted arrival times for the trip are not always available.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>tramNo</td><td style='width: 85%;'>Type: short. 1 to 4-digit tram number as displayed on the tram interior and exterior.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetNextPredictedRoutesCollection">GetNextPredictedRoutesCollection</a>
                
                <span>
                  <br>Returns real-time predicted arrival times for the specified Tracker Stop ID, route number, and low floor requirement.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>stopNo</td><td style='width: 85%;'>Type: short. The 4-digit Tracker ID of the stop.</td></tr><tr><td style='font-weight: bold;'>routeNo</td><td style='width: 85%;'>Type: string. Specify the route number to filter the results to a particular route number, or specify <i>0</i> (zero) to retrieve results for all routes that pass the stop. A route number is 1 to 3-digit followed by 0 or 1 alphabet.</td></tr><tr><td style='font-weight: bold;'>lowFloor</td><td style='width: 85%;'>Type: boolean. Specify <i>true</i> to retrieve low floor only results, or <i>false</i> to retrieve low floor and non low floor results.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service. Validation may be ignored if result exists.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetPlatformStopsByRouteAndDirection">GetPlatformStopsByRouteAndDirection</a>
                
                <span>
                  <br>Returns a list of platform stops for the specified route and direction of travel. To determine the Up and Down direction of travel for a route, use the GetDestinationsForRoute method.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>routeNo</td><td style='width: 85%;'>Type: string. Specify the route number to filter the results to a particular route number, or specify <i>0</i> (zero) to retrieve results for all routes that pass the stop. A route number is 1 to 3-digit followed by 0 or 1 alphabet.</td></tr><tr><td style='font-weight: bold;'>isUpDirection</td><td style='width: 85%;'>Type: boolean. The GetDestinationsForAllRoutes and GetDestinationsForRoute methods can be used to obtain the Up/Down direction information.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetRouteStopsByRoute">GetRouteStopsByRoute</a>
                
                <span>
                  <br>New method for returning a list of stop information for the specified route.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>routeNo</td><td style='width: 85%;'>Type: string. Specify the route number to filter the results to a particular route number, or specify <i>0</i> (zero) to retrieve results for all routes that pass the stop. A route number is 1 to 3-digit followed by 0 or 1 alphabet.</td></tr><tr><td style='font-weight: bold;'>isUpDirection</td><td style='width: 85%;'>Type: boolean. The GetDestinationsForAllRoutes and GetDestinationsForRoute methods can be used to obtain the Up/Down direction information.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetRouteSummaries">GetRouteSummaries</a>
                
                <span>
                  <br>Returns a list of summaries for all main routes in the network.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetSchedulesCollection">GetSchedulesCollection</a>
                
                <span>
                  <br>Returns the next three scheduled passing times for the specified Tracker Stop ID, route number, low floor requirement, day, and time.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>stopNo</td><td style='width: 85%;'>Type: short. The 4-digit Tracker ID of the stop.</td></tr><tr><td style='font-weight: bold;'>routeNo</td><td style='width: 85%;'>Type: string. Specify the route number to filter the results to a particular route number or specify <i>0</i> (zero) to retrieve results for all routes that pass the stop.</td></tr><tr><td style='font-weight: bold;'>lowFloor</td><td style='width: 85%;'>Type: boolean. Specify <i>true</i> to retrieve low floor only results, or <i>false</i> to retrieve low floor and non low floor results.</td></tr><tr><td style='font-weight: bold;'>clientRequestDateTime</td><td style='width: 85%;'>Type: DateTime. The start date and time of the requested schedules.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service. Validation may be ignored if result exists.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetSchedulesForTrip">GetSchedulesForTrip</a>
                
                <span>
                  <br>Returns a list of scheduled arrival times pertaining to a route for the specified trip ID and scheduled departure date and time. To determine the trip ID, use the GetSchedulesCollection method<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>tripID</td><td style='width: 85%;'>Type: int. Use the GetSchedulesCollection method to obtain the trip ID.</td></tr><tr><td style='font-weight: bold;'>scheduledDateTime</td><td style='width: 85%;'>Type: DateTime. The start date and time of the requested schedules.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service. Validation may be ignored if result exists.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetStopInformation">GetStopInformation</a>
                
                <span>
                  <br>Returns the stop information for the specified Tracker Stop ID. This information includes the stop flag number, intersection road names, longitude and latitude coordinates, and the suburb of the stop.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>stopNo</td><td style='width: 85%;'>Type: short. The 4-digit Tracker ID of the stop.</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=GetStopsAndRoutesUpdatesSince">GetStopsAndRoutesUpdatesSince</a>
                
                <span>
                  <br>Returns a list of routes and Tracker IDs whose information have been updated since the date specified in the parameter (dateSince). To obtain detailed information of the updates, use GetStopInformation, GetListOfStopsByRouteNoAndDirection, and GetDestinationsForRoute methods.<br/><br/><table width='100%' cellpadding='4'><tr style='font-weight: bold; color: black; background: #e8e8e8'><td>Parameters</td><td>Description</td></tr><tr><td style='font-weight: bold;'>dateSince</td><td style='width: 85%;'>Type: DateTime. The date and time when the stop and route information was updated. This date cannot be after today's date and cannot be before the 07th July 2009</td></tr><tr><td><b>validationResult</b> (<i>out</i>)</td><td style='width: 85%;'>Type: string. An out parameter that holds any validation message from the service.</td></tr></table><br/>
                </span>
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetDestinationsForAllRoutes">TestGetDestinationsForAllRoutes</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetDestinationsForRoute">TestGetDestinationsForRoute</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetListOfStopsByRouteNoAndDirection">TestGetListOfStopsByRouteNoAndDirection</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetMainRoutes">TestGetMainRoutes</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetMainRoutesForStop">TestGetMainRoutesForStop</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetNextPredictedArrivalTimeAtStopsForTramNo">TestGetNextPredictedArrivalTimeAtStopsForTramNo</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetNextPredictedRoutesCollection">TestGetNextPredictedRoutesCollection</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetPlatformStopsByRouteAndDirection">TestGetPlatformStopsByRouteAndDirection</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetRouteStopsByRoute">TestGetRouteStopsByRoute</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetRouteSummaries">TestGetRouteSummaries</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetSchedulesCollection">TestGetSchedulesCollection</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetSchedulesForTrip">TestGetSchedulesForTrip</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetStopInformation">TestGetStopInformation</a>
                
                
              </li>
              <p>
            
              <li>
                <a href="pids.asmx?op=TestGetStopsAndRoutesUpdatesSince">TestGetStopsAndRoutesUpdatesSince</a>
                
                
              </li>
              <p>
            
              </ul>
            
      </span>

      
      

    <span>
        
    </span>
    
      

      

    
  </body>
</html>
