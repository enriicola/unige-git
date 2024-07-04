Feature: User management
Scenario: Tries to change a user's password with a too short one and fails
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Special pages" link
		And clicks the "Change credentials" link
		And clicks the "User001" link at the center of the page
		And enters "vznb" in the "New password" field
		And enters "vznb" in the "Retype new password" field
		And clicks the "Change credentials" button
	Then an error message saying that the password must have at least 10 characters is displayed
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link