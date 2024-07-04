Feature: User management
Scenario: Adds a user to the system
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Users" link
		And clicks the "Add a new user" link
		And enters "usertest" into the "Username" field
		And enters "usertest123" in the "Password" field
		And enters "usertest123" in the "Confirm Password" field
		And enters "user@test.com" in the "Email" field
		And selects "Administrator" in the "Role" dropdown select
		And clicks the "Save" button
	Then "usertest" appears as second user in the "Users" page

	Given the previous assertion passed
	Then the user clicks the "Log out" link