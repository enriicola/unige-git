Feature: Discount codes
Scenario: Tries to buy a product using a deleted discound code (by amount) and fails
	Given the user is on the home page 
		#the icon is between the language selector and the cart
		When the user clicks on the account icon
		And enters "test@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And goes to the home page of the site
		And clicks the "NewProduct000" link
		And clicks the "Add to cart" button
		And clicks the "Cart" link
		And clicks the "Checkout" button
		And clicks the "Continue to shipping" button
		And clicks the "Proceed to payment" button
		And enters "discount000" in the "Discount code" field
		And clicks the "Apply" button
	#the box is displayed for about 2 seconds then disappears
	Then "Discount code is invalid or expired" is shown in a red box to the bottom of the page
	
	Given the previous assertion passed
	Then the user clicks on the user icon between the language selector and the cart
	And clicks "Logout"