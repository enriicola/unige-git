Feature: Issue management
Scenario: Deletes an issue
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "View issues" link
		And clicks the checkbox of the first issue
		And selects "Delete" in the dropdown select
		And clicks the "OK" button
		And clicks the "Delete Issues" button
	Then the issues table is empty ("Viewing Issues (0 - 0 / 0)" is shown in the header)
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link