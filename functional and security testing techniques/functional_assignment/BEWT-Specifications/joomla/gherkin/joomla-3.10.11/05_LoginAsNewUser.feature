Feature: Site administration login
Scenario: Logins as the newly added user
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "tuser01" in the "Username" field
		And enters "tpassword" in the "Password" field
		And clicks the "Sign in" button
	Then "Test User" is shown as value of the "Name" field
	
	Given the previous assertion passed
	Then the user clicks the "Author Login" link
	And clicks the "Log out" button