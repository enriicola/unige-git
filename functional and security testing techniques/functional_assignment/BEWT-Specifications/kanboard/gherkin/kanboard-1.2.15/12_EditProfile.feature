Feature: User management
Scenario: Changes the email associated to a user's profile
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Settings" link
		And clicks the icon in the top right corner of the page
		And clicks the "Users management" link
		And clicks the "admin" link
		And clicks the "Edit profile" link
		And enters "admin@kanboard.com" in the "Email" field
		And clicks the "Save" button
	Then "admin@kanboard.com" is shown to the right of "Email: "
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link