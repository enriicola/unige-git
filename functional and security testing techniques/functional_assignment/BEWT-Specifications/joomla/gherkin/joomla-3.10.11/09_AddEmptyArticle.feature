Feature: Content management
Scenario: Tries to add an empty article and fails
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Create a Post" link
		And clicks the "Save" button
	Then "Invalid field: Title" is shown in a red box
	
	Given the previous assertion passed
	Then the user clicks the "Author Login" link
	And clicks the "Log out" button