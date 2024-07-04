Feature: Site menus
Scenario: Searches a product using its tag
	Given the user is on the home page 
		When the user clicks the "Test Menu" link
		And clicks the "Search" button
	Then "tag000" is shown to the right of "Category: "
	And "NewProduct000" is the only product shown in the page