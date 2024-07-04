Feature: Site administration
Scenario: Changes the application language (and then sets it back to English)
	Given the user is on the login page (/login)
		When the user enters "admin" in the "Username" field
		And enters "admin" in the "Password" field
		And clicks thre "Sign in" button
		And clicks the icon in the top right corner of the page
		And clicks the "Settings" link
		And clicks the "Application settings" link
		And selects "Italiano" in the "Language" dropdown menu
		And clicks the "Save" button
	Then the language dropdown select is now labeled "Lingua"
	And "Italiano" is selected in the "Lingua" dropdown select

	Given the previous assertions passed
		When the user selects "English (US)" in the "Lingua" dropdown select
		And clicks the "Salva" button
	Then the language selection dropdown select is now labeled "Language"
	And "English (US)" is selected in the "Language" dropdown select
	
	Given the previous assertion passed
	Then the user clicks on the "A" icon in the top-right corner of the screen
	And clicks the "Logout" link