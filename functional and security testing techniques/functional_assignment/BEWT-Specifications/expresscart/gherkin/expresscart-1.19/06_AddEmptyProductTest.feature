Feature: Catalog management
Scenario: Tries to add an empty product to the system and fails
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "+" icon to the right of the link "Products"
		And clicks the "Add product" button
	Then the fileds "Product title" and "Product price" are highlighted in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link