Feature: Login
Scenario: Tries to login with wrong credentials and fails
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "wrongpassword" in the "Password" field
		And clicks the "Log in" button
	Then "Username and password do not match or you do not have an account yet." is shown in a yellow box