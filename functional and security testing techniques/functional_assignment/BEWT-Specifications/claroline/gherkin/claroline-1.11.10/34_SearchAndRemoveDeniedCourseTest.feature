Feature: Course management
Scenario: Searches a denied course using the advanced search function and then removes it
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Advanced" link to the right of the "Search for a course" text field
		And enters "Course003" in the "Course title" field
		And clicks the "Denied" radio button
		And clicks the "Search course" button
	Then "Course003" is shown in the "Course title" column of the first row of the table

	Given the previous assertion passed
		When the user clicks the red cross in the "Delete" column of the table
		And confirms the JavaScript alert
	Then "The course has been successfully deleted" is shown on a green box

	Given the previous assertion passed
	Then the user clicks the "Logout" link