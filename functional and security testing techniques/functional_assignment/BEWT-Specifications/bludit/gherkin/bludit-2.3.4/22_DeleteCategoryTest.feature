Feature: Content management
Scenario: Deletes a category
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Categories" link
		And clicks the "Category001" link
		And clicks on the "Delete" button
	Then "Category001" is not shown in the "Categories" page

	Given the previous assertion passed
	Then the user clicks the "Log out" link