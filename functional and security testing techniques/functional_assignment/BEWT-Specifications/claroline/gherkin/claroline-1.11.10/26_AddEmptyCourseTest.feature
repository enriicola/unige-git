Feature: Course management
Scenario: Tries to add a course without filling the required fields and fails
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create course" link
		And clicks the "Ok" button
	Then "Course title needed" is shown on the page
	And "Course code needed" is shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link