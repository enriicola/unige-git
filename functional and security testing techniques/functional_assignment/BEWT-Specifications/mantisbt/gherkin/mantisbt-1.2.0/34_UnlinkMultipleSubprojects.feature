Feature: Project management
Scenario: Unlinks two subprojects from their parent project
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage Projects" link
		And clicks the "Project001" link
		And clicks the "Unlink" link in the row of "testSubProject1"
		And clicks the "Proceed" link
	Then "testSubProject1" is not shown on the page

	Given the previous assertion passed
	When the user clicks "Unlink" link in the row of "testSubProject2"
		And clicks the "Proceed" link
	Then "testSubProject2" is not shown on the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link