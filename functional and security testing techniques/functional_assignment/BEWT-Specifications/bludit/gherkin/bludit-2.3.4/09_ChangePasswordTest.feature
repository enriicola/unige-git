Feature: User management
Scenario: Changes a user's password
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Users" link
		And clicks the second username in the "Users" page (usertest)
		And clicks the "Change password" link
		And enters "newpassword" in the "New password" field
		And enters "newpassword" in the "Confirm password" field
		And clicks the "Save" button
	Then an alert saying "The changes has been saved" is shown for about 2 seconds in the top right corner of the page

	Given the previous assertion passed
	Then the user clicks the "Log out" link