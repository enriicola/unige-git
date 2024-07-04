Feature: Product review
Scenario: Checks the review to a product
	Given the user is on the home page 
		When the user clicks the "NewProduct000" link
		And clicks on "Recent reviews"
	Then "Title: Review000" is shown on the page
	And "Description: Description000" is shown on the page
	And "Rating: 5" is shown on the page