Feature: Page creation
Scenario: Creates a new user page
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "User001" link
		And clicks the "Create source" link
		And enters "This is my user page"
		And clicks the "Save page" button
	Then the page is displayed with "User001" as title and the previously inserted text as body
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link