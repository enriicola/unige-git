Feature: Shopping cart
Scenario: Adds a product to the cart
	Given the user is on the home page 
		When the user clicks the "NewProduct000" link
		And clicks the "Add to cart" button
		And clicks the "Home" link
	Then "1" is shown in the red square to the right of the "Cart" link
	When the user clicks on the "Cart" link
	Then "NewProduct000" is shown in the "Cart contents"