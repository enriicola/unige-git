Feature: User management
Scenario: Tries to change the password of a user with two non matching passwords and fails
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "tuser01" in the "Username" field
		And enters "newpassword01" in the "Password" field
		And clicks the "Sign in" button
		And enters "asdasdasd22" in the "Password (optional)" field
		And enters "zxczxczxc23" in the "Confirm Password (optional)" field
		And clicks the "Submit" button
	Then "The passwords you entered do not match. Please enter your desired password in the password field and confirm your entry by entering it in the confirm password field." is shown on a yellow box
		
	Given the previous assertion passed
	Then the user clicks the "Author Login" link
	And clicks the "Log out" button