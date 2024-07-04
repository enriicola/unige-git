Feature: Site administration
Scenario: Adds a new currency rate
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Settings" link
		And clicks the "Currency rates" link
		And clicks the "Add or change currency rate " link
		And enters "1.2" in the "Rate" field
		And clicks the "Save" button
	Then the column "Currency" has value "USD"
	And the column "Rate" has value "1.20"
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link