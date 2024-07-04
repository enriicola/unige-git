Feature: Page management
Scenario: Checks that the admin gets a warning message when editing a protected page
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Selenium WebDriver" in the search bar
		And presses Enter
		And clicks "Edit"
	Then a warning message is displayed
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link