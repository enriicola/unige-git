Feature: Product search
Scenario: Searches a product using its tag
	Given the user is on the home page 
		When the user enters "tag000" in the "Search shop" field
		And clicks the "Search" button
	Then "NewProduct000" is the only product shown in the results