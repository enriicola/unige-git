Feature: Course enrolment
Scenario: Enrols a user to a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "testuser1" in the "Username" field
		And enters "testuser1" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Enrol on a new course" link
		And enters "Course001" into the "Search from keyword" field
		And clicks the "Search" button
		#the button is an icon to the right of the "001 - Course001" link
		And clicks the enrolment button
		And clicks the logout button
		And goes to the home page of the site (/claroline11110/index.php)
		And enters "testuser2" in the "Username" field
		And enters "testuser2" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Enrol on a new course" link
		And enters "Course001" into the "Search from keyword" field
		And clicks the "Search" button
		#the button is an icon to the right of the "001 - Course001" link
		And clicks the enrolment button
		And clicks the logout button
		And goes to the home page of the site (/claroline11110/index.php)
		And enters "testuser3" in the "Username" field
		And enters "testuser3" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Enrol on a new course" link
		And enters "Course001" into the "Search from keyword" field
		And clicks the "Search" button
		#the button is an icon to the right of the "001 - Course001" link
		And clicks the enrolment button
		And clicks the logout button
		And goes to the home page of the site (/claroline11110/index.php)
		And enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the button to the left of the "Users" link
	Then the page contains "testuser1"
	And the page contains "testuser2"
	And the page contains "testuser3"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link