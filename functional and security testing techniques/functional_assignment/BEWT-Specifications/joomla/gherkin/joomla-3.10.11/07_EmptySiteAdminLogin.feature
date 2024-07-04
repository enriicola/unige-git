Feature: Site administration login
Scenario: Tries to login to the site administration area with wrong credentials and fails
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Site Administrator" link
		#a new tab opens
		And clicks the "Log in" button
	Then "Empty password not allowed." is shown in a yellow box
	
	Given the previous assertion passed
	Then the user closes the current tab
	And clicks the "Log out" link
	And clicks the "Log out" button