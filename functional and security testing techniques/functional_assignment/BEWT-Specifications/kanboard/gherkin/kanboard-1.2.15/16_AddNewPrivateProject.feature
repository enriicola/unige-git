Feature: Project management
Scenario: Add a new private project
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the "New personal project" link
		And enter "Test private 2" in the "Name" field
		And clicks the "Save" button
	Then "Test private 2" is shown as project title
	And "This project is open" is the first line of the summary
	And "This project is personal" is the third line of the summary
	And "Public access disabled" is the fourth line of the summary
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link