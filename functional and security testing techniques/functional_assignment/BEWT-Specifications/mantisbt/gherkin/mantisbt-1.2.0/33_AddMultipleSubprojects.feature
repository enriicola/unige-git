Feature: Project management
Scenario: Adds a new project and then adds two subprojects
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
		And clicks the "Project001" link
		And clicks the "Create New Subproject" button
		And enters "testSubProject1" in the "Project Name" field
		And clicks the "Add Project" button
		And clicks "Proceed"
	Then "testSubProject1" is shown below "Project001"

	Given the previous assertion passed
	When the user clicks the "Project001" link
		And clicks the "Create New Subproject" button
		And enters "testSubProject1" in the "Project Name" field
		And clicks the "Add Project" button
		And clicks "Proceed"
	Then "testSubProject2" is shown below "testSubProject1"
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link