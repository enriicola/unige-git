Feature: Localization management
Scenario: Adds a new currency
	Given ther user is on the login page of the administration panel (/administrator)
	When the user enters "admin@prestashop.com" in the "Email address" field
		And enters "password" in the "Password" field
		And clicks the "Login" button
		And hovers on "Localization"
		And clicks on "Currencies"
		And clicks the "Add new currency" button
		And enters "Something" in the "Name" field
		And enters "STH" in the "ISO code" field
		And enters "10" in the "Numerico ISO code" field
		And enters "^" in the "Symbol" field
		And clicks on the "Save" button
	Then "Successful creation" is shown on a green box

	Given the previous assertion passed
	Then the user clicks on the user icon in the top right corner of the page
	And clicks the "Sign out" link