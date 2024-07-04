Feature: User management
Scenario: Adds a user to the system
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
		And clicks the "Users" link
	Then "User: TestUser000 - (test000@test.com)\nRole: User" is shown in the third row of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link