Feature: Page management
Scenario: A non-admin user tries to edit a protected page and fails
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Selenium WebDriver" in the search bar
		And presses Enter
		And clicks "Edit"
	Then an error message is displayed and the editor is not available
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link