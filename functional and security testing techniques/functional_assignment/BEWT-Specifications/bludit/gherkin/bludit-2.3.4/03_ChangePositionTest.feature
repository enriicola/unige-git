Feature: Content management
Scenario: Change the position of a content
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Content" link
		And clicks the "Test Content" link
		And clicks the "ADVANCED" button on the right of the screen
		And clears the "POSITION" field
		And enters "30" into the "POSITION" field
		And clicks the "Save" button
		And clicks the "Content" link
		And clicks the "Test Content" link
		And clicks the "ADVANCED" button on the right of the screen
	Then "30" is shown as value of the "POSITION" field

	Given the previous assertion passed
	Then the user clicks the "Log out" link