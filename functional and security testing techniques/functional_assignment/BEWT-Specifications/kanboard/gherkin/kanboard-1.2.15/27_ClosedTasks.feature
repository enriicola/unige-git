Feature: Task management
Scenario: Searches for closed tasks in a project
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And enters "status:closed" in the search bar
		And presses the Enter key
	Then "task 3" is the only result
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link