Feature: User management
Scenario: Tries to add a local user with non matching passwords and fails
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Users management" link
		And clicks the "New user" link
		And enters "TestUser2" in the "Username" field
		And enters "User2" in the "Name" field
		And enters "user2@gmail.com" in the "Email" field
		And clicks the "Save" button
	Then "The password is required" is shown below the "Password" field
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link