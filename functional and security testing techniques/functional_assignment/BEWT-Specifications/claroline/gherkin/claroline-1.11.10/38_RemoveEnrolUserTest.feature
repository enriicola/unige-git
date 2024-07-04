Feature: Course enrolment
Scenario: Removes enrolment of a user to a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "user001" in the "Username" field
		And enters "password001" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Remove course enrolment" link
		#the button is a book with a user icon and a red cross
		And clicks the second button to the right of "001 - Course001"
		And confirms the JavaScript alert
	Then "Your enrollment on the course has been removed" is shown on a green box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link