Feature: User management
Scenario: Tries to add a user without filling all the required fields and fails
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create user" link
		And clicks the "Ok" button
	Then "You left some required fields empty" is shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link