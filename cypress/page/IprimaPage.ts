import GatewayApi from "../api/GatewayApi";

class IprimaPage {
  BASE_URL: string;

  constructor() {
    this.BASE_URL = Cypress.config('baseUrl') || '';
  }

  elements = {
    home: {
      buttonAcceptCookies: () => cy.get('#didomi-notice-agree-button'),
      linkSignIn: () => cy.get('.sign-in'),
    },
    login: {
      inputEmail: () => cy.get('input[type="email"]'),
      inputPassword: () => cy.get('input[type="password"]'),
      buttonSubmit: () => cy.get('button[type="submit"]'),
    },
    profile: {
      buttonProfile: (profile: string) => cy.contains('button', profile),
    }
  };

  /**
   * Visit the page
   * @param path - The path to visit
   * @param cookies - Whether to accept cookies
   */
  visit(path: string = '', cookies: boolean = true) {
    cy.visit(this.BASE_URL + path);
    if(cookies) this.acceptCookies();
  }

  /**
   * Accept cookies
   */
  acceptCookies() {
    this.elements.home.buttonAcceptCookies().click();
  }

  /**
   * Login
   * @param email - The email to login
   * @param password - The password to login
   * @param profile - The profile to login
   */
  login(email: string, password: string, profile: string = 'QA') {
    GatewayApi.intercepts.POST_Request();

    this.visit();

    this.elements.home.linkSignIn().click();
    this.elements.login.inputEmail().type(email);
    this.elements.login.inputPassword().type(password);
    this.elements.login.buttonSubmit().click();

    cy.wait('@POST_Request');

    this.elements.profile.buttonProfile(profile).should('be.visible').and('be.enabled').click();

    cy.wait('@POST_Request');
    cy.url().should('eq', this.BASE_URL);
  }
  
}

export default new IprimaPage();