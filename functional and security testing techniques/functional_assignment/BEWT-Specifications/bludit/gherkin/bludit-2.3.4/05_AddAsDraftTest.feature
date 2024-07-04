Feature: Content management
Scenario: Add a new draft
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks a "New content" link
		And enters "Draft Content" in the "Title" field
		And clicks the "Save as draft" button
	Then "Draft Content" is shown as first content in the "DRAFT" section of the "Manage content" page

	Given the previous assertion passed and the success notification disappeared
	Then the user clicks the "Log out" link