Feature: User management
Scenario: Tries to add a user with the same data of an already existing user and fails
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "+" icon to the right of the link "Users"
		And enters "TestUser000" in the "Users name" field
		And enters "test000@test.com" in the "User email" field
		And enters "password" in the "User password" field
		And enters "password" in the "Password confirm" field
		And clicks the "Create" button
	#the alert is shown for about 2 seconds then disappears
	Then "A user with that email address already exists" is shown in a red alert at the bottom of the table
		
	Given the previous assertion passed
	Then the user clicks the "Logout" link