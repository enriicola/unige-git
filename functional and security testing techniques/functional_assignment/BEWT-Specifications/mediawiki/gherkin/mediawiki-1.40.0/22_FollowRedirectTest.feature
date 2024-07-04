Feature: Page redirection
Scenario: Searches a keyword for which a redirect has been defined
	Given the user is on the home page
	When the user enters "Testing" in the search bar
		And presses Enter
	Then the page "Software testing" is displayed
	And "(Redirected from Testing)" is shown below the page title
		
	Given the previous assertion passed
	Then the user clicks the "Log out" link