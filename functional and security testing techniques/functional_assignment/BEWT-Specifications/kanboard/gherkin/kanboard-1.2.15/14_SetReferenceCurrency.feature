Feature: Site administration
Scenario: Changes the reference currency
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Settings" link
		And clicks the "Currency rates" link
		And clicks the "Change reference currency" link
		And selects "EUR - Euro" in the dropdown select
		And clicks the "Save" button
	Then "Reference currency: EUR" is shown on the page
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link