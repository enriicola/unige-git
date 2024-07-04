Feature: Course management
Scenario: Adds an event to a course
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Agenda" link
		And clicks the "Add an event" link
		And enters "Exam 001" in the "Title" field
		And selects "31" from the select for days
		And selects "May" from the select for months
		And selects "2023" from the select for years
		And enters "Genoa" in the "Location" field
		And clicks the "Ok" button
	Then "Event added to the agenda" is shown in a green box
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link