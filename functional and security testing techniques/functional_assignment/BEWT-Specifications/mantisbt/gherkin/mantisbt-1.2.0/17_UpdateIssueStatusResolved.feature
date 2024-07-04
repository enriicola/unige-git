Feature: Issue management
Scenario: Changes the status of an issue to "resolved"
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "View Issues" link
		And clicks the pencil icon in the row of the first issue
		And selects "resolved" in the "Status" dropdown select
		And clicks the "Update Information" button
	Then "resolved" is shown to the right of "Status"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link