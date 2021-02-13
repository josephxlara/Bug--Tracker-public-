// --> Bug--Tracker Todos as of 2/13/2021 <--

1. Fix URLs. Bug--Tracker's URLs are completely static and must be changed to be more dynamic. Right now they are: '/dashboard' or '/editproject'. They must be: `/dashboard/home/${currentUser.uid}` or `/editproject/${projectUID}`.

2. Upon refresh of the browser, the project takes the user back to the dashboard. I want the project to take them back to the last window they were on.

3. Styling issues. Upon resizing of the browser window, many elements squeeze to sizes that aren't preferable. Also, some elements in the project are misplaced. 