Feature: Issue management
Scenario: Changes the summary of an issue
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "View Issues" link
		And clicks the pencil icon in the row of the first issue
		And clears the "Summary" field
		And enters "Summary002" in the "Summary" field
		And clicks the "Update Information" button
	Then "0000001: Summary002 " is shown to the right of "Summary"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link