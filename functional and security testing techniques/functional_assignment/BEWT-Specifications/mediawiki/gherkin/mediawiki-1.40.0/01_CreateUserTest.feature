Feature: User management
Scenario: Creates a new user
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Special pages" link
		And clicks the "Create account" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And enters "Password001" in the "Confirm Password" field
		And enters "Real Name 001" in the "Real Name" field
		And clicks the "Create" button
	Then "The user account for User001 (talk) has been created." is displayed

	Given the previous assertion passed
	Then the user clicks the "Log out" link