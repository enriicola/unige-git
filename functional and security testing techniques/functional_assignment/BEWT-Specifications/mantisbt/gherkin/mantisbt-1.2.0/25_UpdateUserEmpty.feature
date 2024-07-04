Feature: User management
Scenario: Tries to change a username with an empty string and fails
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Users" link
		And clicks the "username001" link
		And clears the "Username" field
		And clicks the "Update User" button
	Then "The username is invalid. Usernames may only contain Latin letters, numbers, spaces, hyphens, dots, plus signs and underscores." is shown in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link