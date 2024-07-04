Feature: Discount codes
Scenario: Deletes a discount code (by amount)
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Discount codes" link
		And clicks the "Delete" button in the row of "discount000"
		And confirms the JavaScript alert
		And clicks the "Discount codes" link
	Then "discount000" is not shown on the page
		
	Given the previous assertion passed
	Then the user clicks the "Logout" link