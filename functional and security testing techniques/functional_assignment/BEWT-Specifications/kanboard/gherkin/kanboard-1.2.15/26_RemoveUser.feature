Feature: User management
Scenario: Tries to add a local user with a password below 6 characters and fails
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Users management" link
		And clicks the "#3" icon to the left of "remote1"
		And clicks the "Remove" link
		And clicks "Yes" in the confirmation window
	Then "remote1" is not shown on the page
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link