Feature: Page editor
Scenario: Creates a new page containing an hyperlink to another page
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "E2E Web Testing" in the search bar
		And presses Enter
		And clicks the "E2E Web Testing" link
		And closes the notification
		And enters the first part of the text in the editor
		And enters "[[" in the editor
		And enters "Software testing" in the popup search bar
		And clicks the "Software testing" link
		And clicks the editor after the "Software testing" link
		And enters the last part of the text
		And clicks the "Save" button
		And enters "Page created" in the sumamry
		And clicks the "Save page" button
	Then the page is displayed with "E2E Web Testing" as title

	Given the previous assertion passed
	When the user clicks the "Software testing"
	Then the page created in the previous test case is displayed

	Given the previous assertion passed
	Then the user clicks the "Log out" link