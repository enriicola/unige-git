Feature: Content management
Scenario: Changes the visualization order of posts by position
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Advanced" link
		And selects "Position" in the "Order content by" dropdown select
		And clicks on the "Save" button
	Then "Position" appears as selected value in the "Order content by" dropdown select

	Given the previous assertion passed
	Then the user clicks the "Log out" link