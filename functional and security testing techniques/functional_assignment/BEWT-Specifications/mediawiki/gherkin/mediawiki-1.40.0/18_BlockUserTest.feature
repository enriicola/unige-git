Feature: User management
Scenario: Blocks a user
	Given the user is on the home page
	When the user clicks the "Log in" link
		And enters "admin" in the "Username" field
		And enters "Password001" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Special pages" link
		And clicks the "Block user" link
		And enters "User001" in the "Username, IP address, or IP range" field
		#skipping this step will prevent the execution of subsequent test cases from the same IP
		And deselects the checkbox "Automatically block the last IP address used by this user [...]"
		And selects "indefinite" in the "Expiration" dropdown select
		And clicks the "Block this user" button
	Then "User001 has been blocked" is displayed
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link