Feature: Issue management
Scenario: Changes the severity of an issue
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "View Issues" link
		And clicks the pencil icon in the row of the first issue
		And selects "major" in the "Severity" dropdown select
		And clicks the "Update Information" button
	Then "major" is shown to the right of "Severity"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link