/**
 * Selects an option from a dropdown
 * @param dropdownName - The name of the dropdown
 * @param options - The options to select
 */
Cypress.Commands.add('selectDropdown', (dropdownName: string, options: string) => {
    cy.contains('.select-toggle', dropdownName).click();
    cy.contains('.select-option', options).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      selectDropdown(dropdownName: string, options: string): Chainable<void>;
    }
  }
}

export {};