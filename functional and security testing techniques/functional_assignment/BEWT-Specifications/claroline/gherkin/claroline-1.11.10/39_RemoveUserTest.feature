Feature: User management
Scenario: Removes a user from the system
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And enters "user001" into the "Search for a user" field
		And clicks the icon in the "Delete" column of the first row of the table
		And accepts the JavaScript alert
	Then the page does not contain "Name001"
	And the page does not contain "Firstname001"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link