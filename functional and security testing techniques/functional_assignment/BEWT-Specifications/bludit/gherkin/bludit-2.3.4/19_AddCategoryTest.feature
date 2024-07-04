Feature: Content management
Scenario: Adds a new category
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Categories" link
		And clicks the "Add a new category" link
		And enters "Category001" into the "Name" field
		And clicks the "Save" button
	Then "Category001" is shown as first category in the "Categories" page

	Given the previous assertion passed
	Then the user clicks the "Log out" link