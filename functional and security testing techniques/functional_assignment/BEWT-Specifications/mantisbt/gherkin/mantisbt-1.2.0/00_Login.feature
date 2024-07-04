Feature: Login (precondition of all other tests)
Scenario: Logs in as the administrator
	Given the user is on the login page (http://localhost:3000/mantisbt/login_page.php)
	When the user enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Login" button
	Then "Logged in as: administrator (administrator)" is shown below the MANTIS logo

