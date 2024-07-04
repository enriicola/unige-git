Feature: Project management
Scenario: Adds a new project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Create New Project" button
		And enters "Project001" in the "Project Name" field
		And selects "release" in the "Status" dropdown select
		And selects "public" in the "View Status" dropdown select
		And enters "Description" in the "Description" field
		And clicks the "Add Project" button
		And clicks the "Manage" link
		And clicks the "Manage Projects" link
	Then "Project001" is shown as project name
	And "release" is shown as status
	And "public" is shown as "View Status"
	And "Description" is shown as "Description"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link