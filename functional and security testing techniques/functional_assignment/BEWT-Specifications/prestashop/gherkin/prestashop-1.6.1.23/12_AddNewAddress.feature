Feature: Customer management
Scenario: Adds a new customer address
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And hovers on "Customers"
		And clicks on "Addresses"
		And clicks the "Add new address" button
		And enters "pub@prestashop.com" in the "Customer email" field
		And enters "Test" in the "Address alias" field
		And enters "John" in the "First Name" field
		And enters "DOE" in the "Last Name" field
		And enters "Via Torino" in the "Address" field
		And enters "12345" in the "Postcode" field
		And enters "123456789" in the "Home phone" field
		And enters "987654321" in the "Mobile phone" field
		And enters "Bologna" in the "State" field
		And enters "Bologna" in the "City" field
		And clicks the "Save" button
	Then "Successful creation" is shown on a green box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link