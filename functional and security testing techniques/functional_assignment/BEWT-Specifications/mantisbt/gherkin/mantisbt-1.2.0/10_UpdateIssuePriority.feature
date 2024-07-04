Feature: Issue management
Scenario: Changes the priorrity of an issue
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "View Issues" link
		And clicks the pencil icon in the row of the first issue
		And selects "low" in the "Priority" dropdown select
		And clicks the "Update Information" button
	Then "low" is shown to the right of "Priority"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link