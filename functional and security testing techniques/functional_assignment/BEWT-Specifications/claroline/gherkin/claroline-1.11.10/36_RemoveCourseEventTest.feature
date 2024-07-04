Feature: Course management
Scenario: Removes an event from a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Agenda" link
		And clicks the red cross below "Exam 001"
		And confirms the JavaScript alert
	Then "Event deleted from the agenda" is shown in a green box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link