Feature: User management
Scenario: Adds a user's links to social networks
	Given the user is on the login page of the administration panel (/admin)
		When the user enters "admin" in the Username field
		And enters "password" in the Password field
		And clicks the "Login" button
		And clicks the "Users" link
		And clicks the first username in the "Users" page (admin)
		And enters "https://www.facebook.com/some_fake_user_name_52432562135863" in the "Facebook" field
		And enters "https://instagram.com/some_fake_user_name_52432562135863" in the "Instagram" field
		And clicks the "Save" button
		And clicks the "Users" link
		And clicks the first username in the "Users" page (admin)
	Then "https://www.facebook.com/some_fake_user_name_52432562135863" is shown as value of the "Facebook" field
	And "https://instagram.com/some_fake_user_name_52432562135863" is shown as value of the "Instagram" field

	Given the previous assertion passed
	Then the user clicks the "Log out" link