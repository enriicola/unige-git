Feature: Templates
Scenario: Creates a new page using the source editor
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Selenium WebDriver" in the search bar
		And presses Enter
		And clicks the "Edit source" link
		And enters "{{Software|dev=Selenium|ver=3.141.59}}" at the beginning of the page
		And clicks the "Save changes" button
	Then the page is displayed with "Selenium WebDriver"
	And "Developer: Selenium Latest version: 3.141.59" is shown at the beginning of the body
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link