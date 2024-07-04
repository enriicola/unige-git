Feature: Project management
Scenario: Changes the description of a project
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the "#1" icon to the left of "Test 2"
		And clicks the "Configure this project" link
		And clicks the "Edit project" link
		And enters "This is the new description" in the "Description" field
		And clicks the "Save" button
		And clicks the "Summary" link
	Then "This is the new description" is shown below "Description"		
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link