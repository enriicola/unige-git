Feature: Content management
Scenario: Opens the previously created menu to see the archived articles
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Home" link
		And clicks the "Test menu item" link
	Then "Your Modules" is shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Author Login" link
	And clicks the "Log out" button