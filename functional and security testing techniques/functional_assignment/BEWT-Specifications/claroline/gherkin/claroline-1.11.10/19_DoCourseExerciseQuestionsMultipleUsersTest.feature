Feature: Course exercises
Scenario: Multiple users do an exercise
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "testuser1" in the "Username" field
		And enters "testuser1" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the link "Exercise 001"
		And clicks the second radio button for "Question 1"
		And clicks the "False" radio button for "Question 2"
		And clicks the third checkbox for "Question 3"
		And clicks the "Finish the test" button
		And clicks the "Logout" button
		And goes to the home page of the site (/claroline11110/index.php)
		And enters "testuser2" in the "Username" field
		And enters "testuser2" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the link "Exercise 001"
		And clicks the first radio button for "Question 1"
		And clicks the "False" radio button for "Question 2"
		And clicks the third checkbox for "Question 3"
		And clicks the "Finish the test" button
		And clicks the "Logout" button
		And goes to the home page of the site (/claroline11110/index.php)
		And enters "testuser3" in the "Username" field
		And enters "testuser3" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the link "Exercise 001"
		And clicks the first radio button for "Question 1"
		And clicks the "True" radio button for "Question 2"
		And clicks the second checkbox for "Question 3"
		And clicks the "Finish the test" button
		And clicks the "Logout" button
		And goes to the home page of the site (/claroline11110/index.php)
		And enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the icon in the "Statistics" column of the second row
	Then the column "Student" of the third row of the first table contains "testuser1 testuser1"
	And the column "Worst score" of the third row of the first table contains "-3"
	And the column "Student" of the fourth row of the first table contains "testuser2 testuser2"
	And the column "Worst score" of the fourth row of the first table contains "0"
	And the column "Student" of the fifth row of the first table contains "testuser3 testuser3"
	And the column "Worst score" of the fifth row of the first table contains "6"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link