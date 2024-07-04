Feature: Content management
Scenario: Deletes content
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Content" link
		And clicks the "Follow Bludit" link
		And clicks the "Delete" button
		And confirms the JavaScript alert
	Then "Follow Bludit" is not present in the "Manage content" page

	Given the previous assertion passed and the success notification disappeared
	Then the user clicks the "Log out" link