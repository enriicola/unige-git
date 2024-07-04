Feature: User management
Scenario: Deletes a user
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Users" link
		And clicks the "username001" link
		And clicks the "Delete User" button
		And clicks the "Delete Account" button
		And clicks "Proceed"
	Then "username001" is not shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link