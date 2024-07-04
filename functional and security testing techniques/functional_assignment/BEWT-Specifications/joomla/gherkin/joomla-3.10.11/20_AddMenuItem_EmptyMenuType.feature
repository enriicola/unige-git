Feature: Site menus management
Scenario: Tries to add a menu item without selecting a menu item type and fails
	Given the user is on the home page
		When the user clicks the "Author Login" link
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Site Administrator" link
		#a new tab opens
		And enters "administrator" in the "Username" field
		And enters "root" in the "Password" field
		And clicks the "Log in" button
		And clicks the "Menu(s)" link
		And clicks the "Menu Items" link
		And clicks the "New" button
		And enters "Test menu item" in the "Menu Title" field
		And selects "Main Menu" from the "Menu" dropdown select
		And clicks the "Save & Close" button
	Then "Invalid field:  Menu Item Type" is shown on a red box
	
	Given the previous assertion passed
	Then the user clicks the down pointing arrow icon in the top-right corner of the page
	And clicks the "Log out" button
	And closes the current tab
	And clicks the "Log out" link
	And clicks the "Log out" button