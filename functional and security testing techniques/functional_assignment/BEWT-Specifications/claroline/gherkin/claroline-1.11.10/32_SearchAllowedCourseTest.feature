Feature: Course search
Scenario: Searches a course using the advanced search function
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "Platform administration" link
		And clicks the "Advanced" link to the right of the "Search for a course" text field
		And enters "Course001" in the "Course title" field
		And clicks the "Allowed" radio button
		And clicks the "Search course" button
	Then "Course001" is shown in the "Course title" column of the first row of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link