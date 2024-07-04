Feature: Page management
Scenario: Deletes a page
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "E2E Web Testing" in the search bar
		And presses Enter
		And clicks on "More"
		And clicks the "Delete" link
		And clicks the "Delete page" button
	Then a message confirms that the page has been deleted
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link