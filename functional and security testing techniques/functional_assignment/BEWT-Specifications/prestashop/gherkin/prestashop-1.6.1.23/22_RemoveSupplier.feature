Feature: Supplier management
Scenario: Deletes a supplier
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And hovers on "Catalog"
		And clicks on "Suppliers"
		And clicks the down pointing arrow icon at the end of the row of "John"
		And clicks the "Delete" link
		And accepts the JavaScript alert
	Then "Successful deletion" is shown on a green box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link