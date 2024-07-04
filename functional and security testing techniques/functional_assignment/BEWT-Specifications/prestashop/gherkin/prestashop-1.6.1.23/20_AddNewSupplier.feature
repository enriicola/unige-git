Feature: Supplier management
Scenario: Adds a new supplier
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And hovers on "Catalog"
		And clicks on "Suppliers"
		And clicks the "Add new supplier" button
		And enters "John" in the "Name" field
		And enters "Via Fianle Ligure" in the "Address" field
		And enters "Finale Ligure" in the "City" field
		And enters "Italy" in the "Country" field
		And clicks the "Save" button
	Then "Successful creation" is shown on a green box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link