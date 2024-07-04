Feature: Product review
Scenario: Tries to add an empty review to a product and fails
	Given the user is on the home page 
		#the icon is between the language selector and the cart
		When the user clicks on the account icon
		And enters "test@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And goes to the home page of the site
		And clicks the "NewProduct000" link
		And clicks the "Add review" button
		And clicks the "Add review" button
	#the alert is shown for about 2 seconds then disappears
	Then "Please supply a review title" is shown in a red bar to the bottom of the screen
		
	Given the previous assertion passed
	Then the user clicks on the user icon between the language selector and the cart
	And clicks "Logout"