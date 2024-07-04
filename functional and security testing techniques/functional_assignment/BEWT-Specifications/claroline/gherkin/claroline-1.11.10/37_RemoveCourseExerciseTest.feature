Feature: Course management
Scenario: Removes an exercise from a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the red cross in the "Delete" column of the second row of the table
		And confirms the Javascript alert
	Then "Exercise 001" is not shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link