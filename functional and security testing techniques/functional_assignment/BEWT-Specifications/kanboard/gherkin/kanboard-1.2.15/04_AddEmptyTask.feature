Feature: Task management
Scenario: Tries to  add a task without title and fails
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the "Test 2" link
		And clicks the gear icon to the left of the screen
		And clicks the "Add a new task" link
		And clicks the "Save" button
	Then "The project name is required" is show below the "Title" field
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link