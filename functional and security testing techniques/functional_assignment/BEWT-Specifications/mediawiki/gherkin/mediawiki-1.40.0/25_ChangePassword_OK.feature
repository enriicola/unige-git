Feature: User management
Scenario: Tries to change a user's password with a too common one and fails
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "User001" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Special pages" link
		And clicks the "Change credentials" link
		And clicks the "User001" link at the center of the page
		And enters "password123" in the "New password" field
		And enters "password123" in the "Retype new password" field
		And clicks the "Change credentials" button
	Then "Your credentials have been changed." is displayed on a green box
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link