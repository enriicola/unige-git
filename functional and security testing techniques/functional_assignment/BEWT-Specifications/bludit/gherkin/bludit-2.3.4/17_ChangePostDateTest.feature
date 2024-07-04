Feature: Content management
Scenario: Changes the date of a post
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Content" link
		And clicks the "Create your own content" link
		And clicks the "ADVANCED" button on the right of the screen
		And enters "2022-08-03 14:42:26" into the "DATE" field
		And clicks the "Save" button 
		And clicks the "Content" link
		And clicks the "Create your own content" link
		And clicks the "ADVANCED" button on the right of the screen
	Then "2022-08-03 14:42:26" is shown as value of the "DATE" field

	Given the previous assertion passed
	Then the user clicks the "Log out" link