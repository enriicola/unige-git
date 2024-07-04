Feature: User management
Scenario: Adds a local user
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Users management" link
		And clicks the "New user" link
		And enters "Test User" in the "Username" field
		And enters "User1" in the "Name" field
		And enters "user@gmail.com" in the "Email" field
		And enters "test123" in the "Password" field
		And enters "test123" in the "Confirmation" field
		And clicks the "Save" button
	Then "Login: TestUser" is shown in the summary
	And "Full Name: User1" is shown in the summary
	And "Email: user@gmail.com" is shown in the summary
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link