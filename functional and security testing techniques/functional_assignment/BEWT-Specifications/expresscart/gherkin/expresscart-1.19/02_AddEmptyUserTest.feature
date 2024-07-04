Feature: User management
Scenario: Tries to add a empty user to the system and fails
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "+" icon to the right of the link "Users"
		And clicks the "Create" button
	Then all the fields are highlighted in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link