Feature: Login
Scenario: Tries to login with invalid credentials and fails
	Given the user is on the login page
	When the user enters "wrong" in the "Username" field
		And enters "wrong" in the "Password" field
		And clicks the "Login" button
	Then "Your account may be disabled or blocked or the username/password you entered is incorrect." is shown in red