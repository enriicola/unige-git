Feature: Project management
Scenario: Links two subprojects to another project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And selects "testSubProject1" in the dropdown select to the left of the "Add as Subproject" button
		And clicks the "Add as Subproject" button
		And clicks "Proceed"
	Then "testSubProject1" is shown in the first row of the "Subprojects" table

	Given the previous assertion passed
	When the user selects "testSubProject2" in the dropdown select to the left of the "Add as Subproject" button
		And clicks the "Add as Subproject" button
		And clicks "Proceed"
	Then "testSubProject2" is shown in the second row of the "Subprojects" table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link