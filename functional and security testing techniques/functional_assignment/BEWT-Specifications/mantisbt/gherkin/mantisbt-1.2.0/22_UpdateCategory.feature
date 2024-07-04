Feature: Project management
Scenario: Changes a category's name
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And clicks the "Edit" button to the right of "Category001"
		And clears the "Category" field
		And enters "Category002" in the "Category" field
		And clicks the "Update Category" button
	Then "Category002" is shown in the "Category" column of the table in the "Categories" section
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link