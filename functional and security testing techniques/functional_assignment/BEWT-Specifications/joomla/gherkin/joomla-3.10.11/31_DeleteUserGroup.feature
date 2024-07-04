Feature: User management
Scenario: Deletes a user group
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
		And clicks the checkbox to the left of "Test Group 000"
		And clicks the "Delete" button
		And confirms the two JavaScript alerts
	Then "Test Group 000" is not present on the page
	
	Given the previous assertion passed
	Then the user clicks the down pointing arrow icon in the top-right corner of the page
	And clicks the "Log out" button
	And closes the current tab
	And clicks the "Log out" link
	And clicks the "Log out" button