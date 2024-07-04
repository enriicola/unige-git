Feature: User statistics
Scenario: Views the statistics for a user in a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "user001" in the "Username" field
		And enters "password001" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Manage my account" link
		And clicks the "View my statistics" button
		And selects "Course001" from the "Choose a course" select
	Then "Exercise001" is shown on the first row of the "Exercises" column of the "Exercises" table
	And "9" is shown on the first row of the "Best score" column of the "Exercises" table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link