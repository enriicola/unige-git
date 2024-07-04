Feature: Course management
Scenario: Removes a course from the system
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And enters "Course001" into the "Search for a course" field
		And clicks the icon in the "Delete" column of the first row of the table
		And accepts the JavaScript alert
	Then "The course has been successfully deleted" is shown on a green box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link