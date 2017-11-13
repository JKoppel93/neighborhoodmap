!! MAKE SURE REPO IS PROPERLY EXTRACTED! !!

== INSTRUCTIONS TO SETUP LOCALLY (WINDOWS 10) ==

1. Open Internet Information Services (IIS) Manager
2. On left hand panel, right click "Sites" and click "Add Website..."
3. Provide a site name, and under "Physical path" browse and locate the main directory
4. Under IP address, type your computer's IP (can be found by running system command prompt and typing "ipconfig"; locate your IPv4 address). Remember the IP and port number.
5. Apply.
6. On left hand panel, open "Sites" tree and right click the site you added - click "Edit Permissions..."
7. Under "Security" tab, click "Edit"
8. Click "Add..."
9. Click "Advanced"
10. Click "Find Now"
11. Select IIS_IUSRS, and click OK.
12. Repeat step 9-10 and select IUSR this time - click OK. Exit all windows.
13. Open your internet browser and paste XXX.XXX.XX:YY in your URL, where XXX.XXX.XX = your IP address from earlier and YY = the port number you used for your site.
14. The site can now be accessed locally.

== INSTRUCTIONS TO SETUP ON NGROK SERVER ==

1. Download ngrok https://ngrok.com/download
2. Extract and open command prompt from ngrok directory (Shift+Right-Click from directory)
3. Type "ngrok http XXX.XXX.XX:YY, where XXX.XXX.XX = your IP address from earlier and YY = the port number you used for your site.
4. A dialogue should appear - right click and click "Mark". Highlight the URL next to "Forwarding" and copy to your internet browser.
5. The site can now be temporarily accessed through ngrok's URL scheme, so long as the command window is still open.

== HOW TO USE ==

A map will be displayed using Google Map's API. Use the panel icon to toggle the side panel, containing a list of locations. Here you can filter
the locations using a search query, or add the locations to the map via the toggle buttons (or location name on smaller resolutions). Clicking
a marker on the map will display an infowindow, containing the marker's address.

== CREDITS ==

*Author - Jacob Koppel
*Modified code used from Google Maps API documentation and previous Udacity lessons. 
*filterLocations function in main.js modified from Stack Overflow.
*Bootstrap, Knockout, and jQuery for backend framework to project