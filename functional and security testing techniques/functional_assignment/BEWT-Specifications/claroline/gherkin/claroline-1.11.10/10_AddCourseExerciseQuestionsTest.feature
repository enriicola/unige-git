Feature: Course management
Scenario: Adds questions to an exercise
	Given the user is on the home page (/claroline11110/index.php)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks the "Enter" button
		And clicks the "001 - Course001" link
		And clicks the icon to the left of the "Exercises" link
		And clicks the icon on the "Modify" column in the second row of the table
		And clicks the "New question" link

		And enters "Question 1" in the "Title" field
		And clicks the "Multiple choice (Unique answer)" radio button
		And clicks the "Ok" button
		And clicks the first radio button
		And clears the first "Weighting" field
		And enters "3" in the first "Weighting" field
		And clears the second "Weighting" field
		And enters "-3" in the second "Weighting" field
		And clicks the "Ok" button
		And clicks the "New question" link

		And enters "Question 2" in the "Title" field
		And clicks the "True/False" radio button
		And clicks the "Ok" button
		And clicks the first radio button
		And clears the first "Weighting" field
		And enters "3" in the first "Weighting" field
		And clears the second "Weighting" field
		And enters "-3" in the second "Weighting" field
		And clicks the "Ok" button
		And clicks the "New question" link
		And enters "Question 3" in the "Title" field
		And clicks the "Multiple choice (Multiple answers)" radio button
		And clicks the "Ok" button
		And clicks the "Add answ." button
		And clicks the first checkbox
		And clears the first "Weighting" field
		And enters "3" in the first "Weighting" field
		And clears the second "Weighting" field
		And enters "0" in the second "Weighting" field
		And clears the third "Weighting" field
		And enters "-3" in the third "Weighting" field
		And clicks the "Ok" button
		
		And clicks on the "Exercise 001" link
	Then the first row of the table contains "Question 1" in the "Question" column and "Multiple choice (Unique answer)" in the "Answer type" column
	And the second row of the table contains "Question 2" in the "Question" column and "True/False" in the "Answer type" column
	And the third row of the table contains "Question 3" in the "Question" column and "Multiple choice (Multiple answers)" in the "Answer type" column
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link