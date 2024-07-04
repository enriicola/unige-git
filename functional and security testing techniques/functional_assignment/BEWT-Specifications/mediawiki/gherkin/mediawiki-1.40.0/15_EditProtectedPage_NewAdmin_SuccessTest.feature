Feature: User management
Scenario: A newly promoted admin successfully edits a protected page
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Selenium WebDriver" in the search bar
		And presses Enter
		And clicks "Edit"
		And enters the additional text at the end of the editor
		And clicks the "Save" button
		And enters "Page expanded" in the sumamry
		And clicks the "Save page" button
	Then the page is displayed with "Selenium WebDriver" as title and the full text as body
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link