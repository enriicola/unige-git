Feature: Course enrolment
Scenario: Tries to enrol to a closed registration course and fails
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "user001" in the "Username" field
		And enters "password001" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Enrol on a new course" link
		And enters "Course003" into the "Search from keyword" field
		And clicks the "Search" button
		#the button is an icon to the right of the "003 - Course003" link
		And clicks the enrolment button
	Then "This course currently does not allow new enrolments (registration: close)" is shown on a red box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link