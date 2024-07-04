Feature: Site administration
Scenario: Adds a link to a social network for the whole site
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "General" link
		And enters "https://instagram.com/bludit595159516" in the "Instagram" field
		And clicks the "Save" button
	Then "https://instagram.com/bludit595159516" is shown as value of the "Instagram" field

	Given the previous assertion passed
	Then the user clicks the "Log out" link