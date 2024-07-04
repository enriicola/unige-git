Feature: Course management
Scenario: Adds a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create course" link
		And enters "Course001" in the "Course title" field
		And enters "001" in the "Code" field
		And selects "Sciences" from the "Unlinked categories" list
		And clicks the left pointing arrow
		And selects "Economics" from the "Unlinked categories" list
		And clicks the left pointing arrow
		And clicks the "Access allowed to anybody (even without login)" radio button
		And clicks the "Allowed" radio button
		And clicks the "Ok" button
	Then "You have just created the course website : 001" is shown in a green box
	
	Given the previous assertion passed
	Then the user clicks the "Continue" link
	And clicks the "Logout" link