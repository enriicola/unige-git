Feature: Product review
Scenario: Adds a review to a product
	Given the user is on the home page 
		#the icon is between the language selector and the cart
		When the user clicks on the account icon
		And enters "test@test.com" in the "email address" field
		And enters "test" in the "Password" field
		And clicks the "Sign in" button
		And goes to the home page of the site
		And clicks the "NewProduct000" link
		And clicks the "Add review" button
		And enters "Review000" in the "Title:" field
		And enters "Description000" in the "Description:" field
		And enters "5" in the "Rating:" field
		And clicks the "Add review" button
		And clicks on "Recent reviews"
	Then "Title: Review000" is shown on the page
	And "Description: Description000" is shown on the page
	And "Rating: 5" is shown on the page
	
	Given the previous assertion passed
	Then the user clicks on the user icon between the language selector and the cart
	And clicks "Logout"