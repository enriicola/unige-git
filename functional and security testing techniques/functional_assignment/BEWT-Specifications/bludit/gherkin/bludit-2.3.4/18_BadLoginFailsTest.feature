Feature: Login
Scenario: Tries to login with wrong credentials and fails
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "wrongpassword" in the Password field
		And clicks the "Login" button
	Then "Username or password incorrect" is shown above the "Username" field

	Given the previous assertion passed
	Then the user clicks the "Log out" link