Feature: Book tickets
  Scenario: Should book one ticket
    Given user is on "/hall.php" page
    When user books one seat
    Then user sees "/payment.php" page
    And user sees one seat booked

  Scenario: Should book two tickets
    Given user is on "/hall.php" page
    When user books two seats
    Then user sees "/payment.php" page
    And user sees two seats booked

  Scenario: Should not book already booked seat
    Given user is on "/hall.php" page
    When user chooses booked seat
    Then accepting button is disabled