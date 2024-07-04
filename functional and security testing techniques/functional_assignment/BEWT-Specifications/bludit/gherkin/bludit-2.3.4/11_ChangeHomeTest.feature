Feature: Site administration
Scenario: Changes the home page of the site
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Advanced" link
		And selects "Create your own content" in the "Homepage" dropdown select
		And clicks on the "Save" button
	Then "Create your own content" appears as selected value in the "Homepage" dropdown select

	Given the previous assertion passed
	Then the user clicks the "Log out" link