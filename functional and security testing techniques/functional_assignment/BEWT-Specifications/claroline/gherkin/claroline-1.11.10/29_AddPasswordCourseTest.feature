Feature: Course management
Scenario: Adds a password protected course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Create course" link
		And enters "Course002" in the "Course title" field
		And enters "002" in the "Code" field
		And selects "Humanities" from the "Unlinked categories" list
		And clicks the left pointing arrow
		And clicks the "Allowed with enrolment key" checkbox
		And enters "password" in the text field to the left of "Allowed with enrolment key"
		And clicks the "Access allowed to anybody (even without login)" radio button
		And clicks the "Ok" button
	Then "You have just created the course website : 002" is shown in a green box
		
	Given the previous assertion passed
	Then the user clicks the "Continue" link
	And clicks the "Logout" link