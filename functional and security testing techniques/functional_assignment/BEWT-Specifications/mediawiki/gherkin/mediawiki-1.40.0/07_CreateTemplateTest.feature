Feature: Templates
Scenario: Creates a new template
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Template:Software" in the search bar
		And presses Enter
		And clicks the "Template:Software" link
		And enters "Developer: {{{dev}}} Latest version: {{{ver}}}" in the editor
		And clicks the "Save page" button
	Then the page is displayed with "Template:Software" as title and the previously inserted text as body
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link