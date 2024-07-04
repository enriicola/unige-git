Feature: Issue management
Scenario: Assigns an issue to the administrator
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "View Issues" link
		And clicks the checkbox of the first issue
		And selects "Assign" in the dropdown select
		And clicks the "OK" button
		And clicks the "Assign Isues" button
	Then "assigned (administrator)" is shown in the "Status" column of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link