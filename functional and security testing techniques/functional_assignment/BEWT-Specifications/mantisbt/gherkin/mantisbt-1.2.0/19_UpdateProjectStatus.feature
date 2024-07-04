Feature: Project management
Scenario: Changes the status of a project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And selects "Stable" in the "Status" dropdown select
		And clicks the "Update Project" button
	Then "stable" is shown in the "Status" column of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link