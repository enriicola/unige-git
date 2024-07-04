Feature: User management
Scenario: Check the users permissions on a project
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "#1" icon to the left of "Test 2"
		And clicks the "Configure this project" link
		And clicks the "Permissions" link
	Then "admin" is the only user shown in the "Allowed Users" section
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link