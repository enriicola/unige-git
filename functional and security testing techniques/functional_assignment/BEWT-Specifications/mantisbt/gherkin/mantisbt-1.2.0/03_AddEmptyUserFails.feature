Feature: User management
Scenario: Tries to add an empty user and fails
	Given the user is on the home of the site and logged as administrator
	When the user clicks the "Manage" link
		And clicks the "Manage users" link
		And clicks the "Create new account" button
		And clicks the "Create user" button
	Then "A necessary field \"\" was empty. Please recheck your inputs." is shown in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link