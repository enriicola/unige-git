Feature: Discount codes
Scenario: Tries to add an empty discount code and fails
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Discount codes" link
		And clicks the "New discount" button
		And clicks the "Add disocunt" button
	Then the fields "Discount code" and "Discount value" are highlighted in red
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link