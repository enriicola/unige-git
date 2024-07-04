Feature: User management
Scenario: Adds a remote user
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Users management" link
		And clicks the "New user" link
		And enters "TestRemote" in the "Username" field
		And enters "remote1" in the "Name" field
		And enters "remote@gmail.com" in the "Email" field
		And clicks the "Remote user" checkbox
		And clicks the "Save" button
	Then "Login: TestRemote" is shown in the summary
	And "Full Name: remote1" is shown in the summary
	And "Email: remote@gmail.com" is shown in the summary
	And "Account type: Remote" is shown in the "Security" section
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link