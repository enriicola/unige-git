Feature: Content management
Scenario: Add a new content
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks a "New content" link
		And enters "Test Content" in the "Title" field
		And clicks the "Save" button
	Then "Test Content" is shown as first content in the "Published" section of the "Manage content" page

	Given the previous assertion passed and the success notification disappeared
	Then the user clicks the "Log out" link