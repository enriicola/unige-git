Feature: User management
Scenario: Remove multiple users from the system
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And enters "testuser" into the "Search for a user" field
		And clicks the icon in the "Delete" column of the first row of the table
		And accepts the JavaScript alert
		And clicks the icon in the "Delete" column of the first row of the table
		And accepts the JavaScript alert
		And clicks the icon in the "Delete" column of the first row of the table
		And accepts the JavaScript alert
	Then "Deletion of the user was done sucessfully" is shown in a green box
	And the page does not contain "testuser1"
	And the page does not contain "testuser2"
	And the page does not contain "testuser3"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link