Feature: Course search
Scenario: Searches a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And enters "Course001" in the "Search for a course" field
		And clicks the "Go" button on the right of the "Search for a course" field
	Then "Course001" is shown in the "Course title" column of the first row of the table
	And "001" is shown in the "Code" column of the first row of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link