Feature: Page editor
Scenario: Edits a page
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Software testing" in the search bar
		And presses Enter
		And clicks the "Edit" link
		And enters the additional text at the end of the editor
		And clicks the "Save" button
		And enters "Page expanded" in the sumamry
		And clicks the "Save page" button
	Then the page is displayed with "Software testing" as title and the full text as body
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link