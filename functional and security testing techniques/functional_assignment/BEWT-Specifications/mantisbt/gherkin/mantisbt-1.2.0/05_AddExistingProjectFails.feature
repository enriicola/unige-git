Feature: Project management
Scenario: Tries to add an existing project and fails
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Create New Project" button
		And enters "Project001" in the "Project Name" field
		And selects "release" in the "Status" dropdown select
		And selects "public" in the "View Status" dropdown select
		And enters "Description" in the "Description" field
		And clicks the "Add Project" button
	Then "A project with that name already exists. Please go back and enter a different name." is shown in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link