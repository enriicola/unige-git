Feature: Project management
Scenario: Tries to change a category's name with an empty string and fails
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And clicks the "Edit" button to the right of "Category001"
		And clears the "Category" field
		And clicks the "Update Category" button
	Then "A necessary field \"\" was empty. Please recheck your inputs." is shown in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link