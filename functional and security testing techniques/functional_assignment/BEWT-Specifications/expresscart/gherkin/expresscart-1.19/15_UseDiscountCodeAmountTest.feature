Feature: Discount codes
Scenario: Buys a product using a discound code (by amount)
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
		And waits for at least 6 seconds
	Then "Discount: £3.00" is displayed on the page
	
	Given the previous assertion passed
	Then the user clicks on the user icon between the language selector and the cart
	And clicks "Logout"