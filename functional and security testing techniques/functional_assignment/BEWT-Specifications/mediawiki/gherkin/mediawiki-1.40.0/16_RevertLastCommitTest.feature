Feature: Page versioning
Scenario: The last edit made to a page is reverted
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Selenium WebDriver" in the search bar
		And presses Enter
		And clicks "View history"
		And clicks the "rollback 1 edit" link
	Then an "Action complete" page with the comparison of the two different versions of the edited page is shown

	Given the previous assertion passed
	When the user clicks on the "Selenium WebDriver" link
	Then the old version of the page is displayed
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link