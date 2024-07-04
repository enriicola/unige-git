Feature: Order management
Scenario: Tries to create an order for an out of stock product and fails
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And clicks on "Orders"
		And clicks the "Add new order" button
		And enters "John" into the "Search for a customer" field
		And clicks on the "Choose" button
		And enters "Blue" into the "Search for a product" field
		And enters "4" in the "Quantity" field
		And clicks on the "Add to cart" button
	Then "There is not enough product in stock." is shown on a red box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link