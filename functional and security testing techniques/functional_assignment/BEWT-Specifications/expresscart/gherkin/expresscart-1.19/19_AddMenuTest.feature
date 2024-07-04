Feature: Site menus
Scenario: Adds a menu
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Menu" link
		#placeholder: Contact Us
		And enters "Test Menu" in the first empty field
		#placeholder: /contact
		And enters "/category/tag000" in the second empty field
		And clicks the green "+" button
	#the box is displayed for about 2 seconds, then disappears
	Then "Menu created successfully" appears in a green box at the bottom of the screen
		
	Given the previous assertion passed
	Then the user clicks the "Logout" link