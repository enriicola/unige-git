Feature: Course enrolment
Scenario: The user tries to enrol to a password protected course using a wrong password and fails
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "user001" in the "Username" field
		And enters "password001" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Enrol on a new course" link
		And enters "Course002" into the "Search from keyword" field
		And clicks the "Search" button
		#the button is an icon to the right of the "001 - Course001" link
		And clicks the enrolment button
		And enters "passowrd" in the "Enrolment key" text field
		And clicks the "Ok" button
	Then "Invalid enrolment key given" is shown on a red box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link