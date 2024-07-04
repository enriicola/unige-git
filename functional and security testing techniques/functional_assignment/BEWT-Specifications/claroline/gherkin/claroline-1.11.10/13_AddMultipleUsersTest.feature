Feature: User management
Scenario: Adds a user to the system
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create user" link
		And enters "testuser1" in the "Name" field
		And enters "testuser1" in the "First name" field
		And enters "testuser1" in the "Username" field
		And enters "testuser1" in the "Password" field
		And enters "testuser1" in the "Password (Confirmation)" field
		And clicks the "Follow courses (student)" radio button
		And clicks the "Ok" button
		And clicks the "Create user" link
		And enters "testuser2" in the "Name" field
		And enters "testuser2" in the "First name" field
		And enters "testuser2" in the "Username" field
		And enters "testuser2" in the "Password" field
		And enters "testuser2" in the "Password (Confirmation)" field
		And clicks the "Create courses (teacher)" radio button
		And clicks the "Ok" button
		And clicks the "Create user" link
		And enters "testuser3" in the "Name" field
		And enters "testuser3" in the "First name" field
		And enters "testuser3" in the "Username" field
		And enters "testuser3" in the "Password" field
		And enters "testuser3" in the "Password (Confirmation)" field
		And clicks the "Manage platform (administrator)" radio button
		And clicks the "Ok" button
		And clicks the "Back to admin page" link
		And clicks the "User list" link
	Then the page contains "testuser1"
	And the page contains "testuser2"
	And the page contains "testuser3"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link