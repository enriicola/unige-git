Feature: Project management
Scenario: Deletes a project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And clicks the "Delete Project" button
		And clicks the "Delete Project" button
	Then "Project001" is not shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link