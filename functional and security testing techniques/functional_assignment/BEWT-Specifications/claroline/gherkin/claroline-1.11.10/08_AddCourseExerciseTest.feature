Feature: Course management
Scenario: Adds an exercise to a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the "New exercise" link
		And enters "Exercise 001" in the "Title" field
		And clicks the "Ok" button
	Then "Exercise added" is shown in a green box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link