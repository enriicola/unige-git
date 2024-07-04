Feature: Project management
Scenario: Add a new project
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the "New project" link
		And enter "Test 2" in the "Name" field
		And clicks the "Save" button
	Then "Test 2" is shown to the right of the "KB" logo
	And "This project is open" is shown below "Summary"

	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link