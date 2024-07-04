Feature: User search
Scenario: Search a user in the system
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And enters "user001" into the "Search for a user" field
		And clicks the "Go" button on the right of the "Search for a user" field
	Then "Name001" is shown in the "Name" column of the first row of the table
	And "Firstname001" is shown in the "First name" column of the first row of the table
	And "User" is shown in the "Status" coulmn of the first row of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link