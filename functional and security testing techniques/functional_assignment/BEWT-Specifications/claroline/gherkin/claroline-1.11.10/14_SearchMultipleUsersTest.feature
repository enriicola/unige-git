Feature: User search
Scenario: Searches multiple users in the system
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And enters "testuser" into the "Search for a user" field
		And clicks the "Go" button on the right of the "Search for a user" field
		And clicks the "No." link in the header of the first column of the table
	Then "testuser1" is shown in the "Name" column of the first row of the table
	And "testuser2" is shown in the "Name" column of the second row of the table
	And "testuser3" is shown in the "Name" column of the third row of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link