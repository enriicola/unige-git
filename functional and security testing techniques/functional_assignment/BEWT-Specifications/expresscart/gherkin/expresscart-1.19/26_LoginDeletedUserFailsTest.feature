Feature: Login
Scenario: Tries to login as a deleted user and fails
	Given the user is on the administrative home page (/admin)
		When the user enters "test000@test.com" in the "email address" field
		And enters "password" in the "Password" field
		And clicks the "Sign in" button
	#the box is displayed for about 2 seconds then disappears
	Then "A user with that email does not exist." is shown in a red box to the bottom of the page