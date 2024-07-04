Feature: User management
Scenario: Tries to create an empty user and fails
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Special pages" link
		And clicks the "Create account" link
		And clicks the "Create account" button
	Then a HTML5 alert is displayed on the "Username" field
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link