Feature: User management
Scenario: Tries to add an already existing user and fails
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage users" link
		And clicks the "Create new account" button
		And enters "username001" in the "Username" field
		And enters "username001" in the "Real Name" field
		And enters "username@username.it" in the "E-mail" field
		And selects "updater" in the "Access Level" dropdown select
		And clicks the "Create user" button
	Then "That username is already being used. Please go back and select another one." is shown in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link