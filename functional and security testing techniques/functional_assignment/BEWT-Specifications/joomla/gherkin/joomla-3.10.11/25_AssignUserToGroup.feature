Feature: User management
Scenario: Assigns a user to a group
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
		And clicks the "Users" link on the sidebar
		And clicks the "Test User" link
		And clicks the "Assigned User Groups" link
		And clicks the "Test Group 000" checkbox
		And clicks the "Save & Close" button
	Then the "Test User" row of the table contains "Test Group 000" in the "User Groups" column
	
	Given the previous assertion passed
	Then the user clicks the down pointing arrow icon in the top-right corner of the page
	And clicks the "Log out" button
	And closes the current tab
	And clicks the "Log out" link
	And clicks the "Log out" button