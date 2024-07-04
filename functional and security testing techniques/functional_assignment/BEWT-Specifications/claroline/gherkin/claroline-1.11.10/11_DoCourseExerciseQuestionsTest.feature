Feature: Course exercises
Scenario: Does an exercise in the role of a user
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "user001" in the "Username" field
		And enters "password001" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the link "Exercise 001"
		And clicks the first radio button for "Question 1"
		And clicks the "True" radio button for "Question 2"
		And clicks the first checkbox for "Question 3"
		And clicks the "Finish the test" button
	Then "Your total score is 9/9" is shown at the bottom of the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link