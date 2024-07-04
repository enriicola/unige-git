Feature: Catalog management
Scenario: Adds a product to the system
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "+" icon to the right of the link "Products"
		And enters "NewProduct000" in the "Product title" field
		And enters "15.95" in the "Product price" field
		And enters "Description for product 000" in the "Product description" field
		And clicks the "Add product" button
		And clicks the "Products" link
	Then "NewProduct" is shown in the first row of the table
		
	Given the previous assertion passed
	Then the user clicks the "Logout" link