@login
Feature: Login

    @loginDanakiniFinance
    Scenario: Successful Login
        Given I am on the login screen Danakini Finance
        When I enter valid login credentials
        Then I should see a Success greeting
        And the page should be closed when I click on Lewati button
    
    @loginDanakini
    Scenario: Successful Lanjut TanpaLogin
        Given I am on the login screen Danakini
        # When I enter valid login credentials
        # Then I should see a Success greeting
        # And the page should be closed when I click on Lewati button
