Feature: Discount codes
Scenario: Adds a discount code (by percent) to the system
	Given the user is on the administrative home page (/admin)
		When the user enters "owner@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And clicks the "Discount codes" link
		And clicks the "New discount" button
		And enters "discperc000" in the "Discount" field
		And selects "Percent" in the "Discount type" dropdown select
		And enters "50" in the "Discount value" field
		#the dates must include the time in which the test suite is run, otherwise subsequent test "UseDiscountCodePercentTest" will fail
		And enters "12/02/2024 00:00" in the "Discount start" field
		And enters "12/02/2025 00:00" in the "Discount end" field
		And clicks the "Add disocunt" button
		And clicks the "Discount codes" button
	Then "Code: discperc000" is shown in the last row of the table
	
	Given the previous assertion passed
	Then the user clicks the "Logout" link