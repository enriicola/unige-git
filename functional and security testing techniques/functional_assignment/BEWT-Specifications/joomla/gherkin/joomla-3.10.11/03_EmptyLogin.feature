Feature: Login
Scenario: Tries to login with empty credentials and fails
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And clicks the "Log in" button
	Then "Please fill out this field." is shown as a HTML 5 validation message