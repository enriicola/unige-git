Feature: User management
Scenario: Tries to add a user with a badly formatted e-mail and fails
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create user" link
		And enters "user" in the "Name" field
		And enters "user" in the "First name" field
		And enters "user" in the "Username" field
		And enters "pass" in the "Password" field
		And enters "pass" in the "Password (Confirmation)" field
		And enters "email" in the "Email" field
		And clicks the "Follow courses (student)" radio button
		And clicks the "Ok" button
	Then "The email address is not valid" empty is shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link