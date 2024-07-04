Feature: Catalog management
Scenario: Deletes a product tag
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Products" link
		And clicks the "NewProduct000" link
		And clicks the "x" to the righg of "tag000"
		And clicks the "Save product" button
	Then "tag000" is not shown in the page
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link