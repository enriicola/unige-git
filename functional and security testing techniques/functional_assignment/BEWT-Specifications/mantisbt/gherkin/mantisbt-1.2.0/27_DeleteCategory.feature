Feature: Project management
Scenario: Deletes a category
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And clicks the "Delete" button in the row of "Category002"
		And clicks the "Delete Category" button
		And clciks the "Proceed" link
	Then the page does not contain "Category002"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link