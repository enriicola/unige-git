Feature: Course management
Scenario: Makes an exercise visible
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
	Then the icon displayed at the column "Visibility" of the second row of the table has "Make visible" as alt text
	
	Given the previous assertion passed
		When the user clicks the icon displayed at the column "Visibility" of the second row of the table
	Then the icon displayed at the column "Visibility" of the second row of the table has "Make invisible" as alt text
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link