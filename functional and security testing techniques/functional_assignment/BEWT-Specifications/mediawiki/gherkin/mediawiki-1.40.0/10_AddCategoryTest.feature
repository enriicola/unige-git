Feature: Page management
Scenario: Adds a new category
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And enters "Selenium WebDriver" in the search bar
		And presses Enter
		And clicks the "Edit" link
		And clicks the icon with three lines
		And clicks "Categories"
		And enters "Browser automation tools" in the "Add a category" field
		And presses Enter
		And clicks the "Apply changes" button
		And clicks the "Save" button
		And enters "Added category" in the sumamry
		And clicks the "Save page" button
	Then the page has title "Selenium WebDriver"
	And "Category: Browser automation tools" is displayed at the end of the page
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link