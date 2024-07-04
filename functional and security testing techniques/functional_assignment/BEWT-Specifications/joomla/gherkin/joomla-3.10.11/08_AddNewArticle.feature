Feature: Content management
Scenario: Adds a new article
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Create a Post" link
		And enters "Test Article 01" in the "Title" field
		And enters "This is the body of the first article for testing the platform" in the main text editor
		And clicks the "Save" button
	Then "Test Article 01" is shown as title of the first article
	And "This is the body of the first article for testing the platform" is shown as text of the first article
	
	Given the previous assertion passed
	Then the user clicks the "Author Login" link
	And clicks the "Log out" button