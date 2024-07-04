Feature: Product search
Scenario: Searches a product in the store
	Given the user is on the home page 
		When the user enters "NewProduct000" in the "Search shop" field
		And clicks the "Search" button
	Then "NewProduct000" is shown to the right of "Search results:"
	And "NewProduct000" is the only product shown in the results