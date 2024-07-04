Feature: Catalog management
Scenario: Changes the name of a category
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And hovers on "Catalog"
		And clicks on "Categories"
		And clicks the "Edit" button on the row of "Winters Collection"
		And clears the "Name" field
		And enters "Fall Collection" in the "Name" field
		And clicks the "Save" button
	Then "Successful update" is shown on a green box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link