Feature: Product search
Scenario: Searches for a deleted product and fails
	Given the user is on the home page 
		When the user enters "NewProduct000" in the "Search shop" field
		And clicks the "Search" button
	Then "No products found" is shown in red on the page