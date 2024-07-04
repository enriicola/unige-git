Feature: Login
Scenario: Logins as the newly added user
	Given the user is on the administrative home page (/admin)
		When the user enters "test000@test.com" in the "email address" field
		And enters "password" in the "Password" field
		And clicks the "Sign in" button
	Then "Dashboard" is shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link