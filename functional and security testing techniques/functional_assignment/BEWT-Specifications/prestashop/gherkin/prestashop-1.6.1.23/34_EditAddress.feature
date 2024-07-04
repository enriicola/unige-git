Feature: Customer management
Scenario: Edits a customer address
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And hovers on "Customers"
		And clicks on "Addresses"
		And clicks the "Edit" button in the first row
		And clears the "First Name" field
		And enters "Bob" in the "First name" field
		And clicks the "Save" button
	Then "Successful upate" is shown on a green box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link