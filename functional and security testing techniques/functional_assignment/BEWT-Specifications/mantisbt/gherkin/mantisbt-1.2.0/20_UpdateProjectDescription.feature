Feature: Project management
Scenario: Changes the description of a project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And clears the "Description" field
		And enters "UpdatedDescription" in the "Description" field
		And clicks the "Update Project" button
	Then "UpdatedDescription" is shown in the "Description" column of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link