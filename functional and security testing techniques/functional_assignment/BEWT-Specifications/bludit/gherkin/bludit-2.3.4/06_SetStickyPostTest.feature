Feature: Content management
Scenario: Set a content as sticky
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Content" link
		And clicks the "Set up your new site" link
		And clicks the "ADVANCED" button on the right of the screen
		And selects "Sticky" in the "STATUS" dropdown select
		And clicks the "Save" button
		And clicks the "Content" link
	Then "Set up your new site" is shown as first post in the "STICKY" section

	Given the previous assertion passed
	Then the user clicks the "Log out" link