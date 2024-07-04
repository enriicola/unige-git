Feature: User management
Scenario: Tries to add a user with the same data of an already existing user and fails
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create user" link
		And enters "Name001" in the "Name" field
		And enters "firstname001" in the "First name" field
		And enters "user001" in the "Username" field
		And enters "password001" in the "Password" field
		And enters "password001" in the "Password (Confirmation)" field
		And clicks the "Follow courses (student)" radio button
		And clicks the "Ok" button
	Then "This username is already taken" empty is shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link