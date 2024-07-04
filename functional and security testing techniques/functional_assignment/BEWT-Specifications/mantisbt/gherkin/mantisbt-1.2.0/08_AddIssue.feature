Feature: Issue management
Scenario: Adds a new issue
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Report Issue" link
		And selects "Category001" in the "Category" dropdown select
		And selects "random" in the "Reproducibility" dropdown select
		And selects "crash" in the "Severity" dropdown select
		And selects "immediate" in the "Priority" dropdown select
		And enters "Summary001" in the "Summary" field
		And enters "description001" in the "Description" field
		And clicks the "Submit Report" button
		And clicks the "View Issues" link
	Then "Category001" is shown as category of the only issue
	And "crash" is shown as severity of the only issue
	And "Summary001" is shown as summary of the only issue
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link