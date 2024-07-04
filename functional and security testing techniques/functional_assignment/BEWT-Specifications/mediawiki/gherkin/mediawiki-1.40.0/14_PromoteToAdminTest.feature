Feature: User management
Scenario: Promotes a standard user to administrator
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Special pages" link
		And clicks the "User rights" link
		And enters "User001" in the "Enter a username" field
		And clicks the "Load user groups" button
		And clicks the "administrator" checkbox
		And enters "promotion" in the "Reason" field
		And clicks the "Save user groups" button
	Then the "administrator" checkbox is checked 
	And an entry about the promotion is shown in the "User rights log" section
	
	Given the previous assertion passed
	Then the user clicks the "Log out" link