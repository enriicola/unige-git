Feature: Site administration
Scenario: Changes the refresh interval of the application
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Settings" link
		And clicks the "Board settings" link
		And enters "85" in the "Refresh interval for public board" field
		And clicks the "Save" button
		And clicks the "Application settings" link
		And clicks the "Board settings" link
	Then "85" is the value of the "Refresh interval for public board" field
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link