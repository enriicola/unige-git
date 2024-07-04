Feature: Course enrolment
Scenario: Unsubscribe multiple users from a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Users" link
		And clicks the icon in the "Unregister" column of the third row of the table
		And accepts the JavaScript alert
		And clicks the icon in the "Unregister" column of the third row of the table
		And accepts the JavaScript alert
		And clicks the icon in the "Unregister" column of the third row of the table
		And accepts the JavaScript alert
	Then the page does not contain "testuser1"
	And the page does not contain "testuser2"
	And the page does not contain "testuser3"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link