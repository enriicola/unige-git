Feature: User management
Scenario: Adds a new user
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Site Administrator" link
		#a new tab opens
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Users" link
		And clicks the "New" button
		And enters "Test User" in the "Name" field
		And enters "tuser01" in the "Login Name" field
		And enters "tpassword" in the "Password" field
		And enters "tpassword" in the "Confirm Password" field
		And enters "testmail@example.com" in the "Email" field
		And clicks the "Save & Close" button
	Then "Test User", "tuser01" and "testmail@example.com" are shown respectively as name, username and email in the second row of the table
	
	Given the previous assertion passed
	Then the user clicks the down pointing arrow icon in the top-right corner of the page
	And clicks the "Log out" button
	And closes the current tab
	And clicks the "Log out" link
	And clicks the "Log out" button