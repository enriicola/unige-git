Feature: Project management
Scenario: Tries to add an existing category and fails
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And enters "Category001" in the text fielkd to the left of the "Add Category" button
		And clicks the "Add Category" button
	Then "A category with that name already exists." is shown in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link