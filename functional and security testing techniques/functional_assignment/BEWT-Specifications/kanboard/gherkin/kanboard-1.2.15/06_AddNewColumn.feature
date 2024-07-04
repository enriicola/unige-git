Feature: Project management
Scenario: Adds a new column
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the "#1" icon to the left of "Test 2"
		And clicks the "Configure this project" link
		And clicks the "Columns" link
		And clicks the "Add a new column" link
		And enters "New Column 3" in the "Column" field
		And clicks the "Save" button
	Then "New Column 3" is shown in the last row of the table
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link