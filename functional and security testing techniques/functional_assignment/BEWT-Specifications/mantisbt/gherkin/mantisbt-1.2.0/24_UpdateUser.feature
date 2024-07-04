Feature: User management
Scenario: Changes a user's real name
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Users" link
		And clicks the "username001" link
		And clears the "Real Name" field
		And enters "username002" in the "Real Name" field
		And clicks the "Update User" button
		And clicks "Proceed"
	Then "username002" is shown as value of the "Real Name" field
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link