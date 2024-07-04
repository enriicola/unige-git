Feature: User management
Scenario: Adds a group
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
		And clicks the "User Groups" link
		And clicks the "New" button
		And enters "Test Group 000" in the "Group Title" field
		And clicks the "Save & Close" button
	Then "Test Group 000" is shown in the last row of the table
	
	Given the previous assertion passed
	Then the user clicks the down pointing arrow icon in the top-right corner of the page
	And clicks the "Log out" button
	And closes the current tab
	And clicks the "Log out" link
	And clicks the "Log out" button