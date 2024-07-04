Feature: Content management
Scenario: Change the URL of a content
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Content" link
		And clicks the "Test Content" link
		And clicks the "ADVANCED" button on the right of the screen
		And clears the "FRIENDLY URL" field
		And enters "new-post-url" in the "FRIENDLY URL" field
		And clicks the "Save" button
		And clicks the "Content" link
	Then "/new-post-url" is shown as URL of the "Test Content" content

	Given the previous assertion passed
	Then the user clicks the "Log out" link