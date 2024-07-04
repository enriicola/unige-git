Feature: Project management
Scenario: Changes the view status (visibility) of a project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And selects "private" in the "View Status" dropdown select
		And clicks the "Update Project" button
	Then "private" is shown in the "View status" column of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link