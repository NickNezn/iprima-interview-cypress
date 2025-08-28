import GatewayApi from "../api/GatewayApi";

class IprimaPage {
  BASE_URL: string;

  constructor() {
    this.BASE_URL = Cypress.config("baseUrl") || "";
  }

  // Locators
  elements = {
    home: {
      buttonAcceptCookies: () => cy.get("#didomi-notice-agree-button"),
      linkSignIn: () => cy.get(".sign-in"),
    },

    login: {
      inputEmail: () => cy.get('input[type="email"]'),
      inputPassword: () => cy.get('input[type="password"]'),
      buttonSubmit: () => cy.get('button[type="submit"]'),
    },

    // “Kdo se dívá?” screen
    whoIsWatching: {
      heading: () => cy.contains("h1,h2", /Kdo se dívá\?|Who is watching\?/i),

      // Běžný
      addNormalBtnDirect: () =>
        cy.contains("button", /Běžný|Bežný|Bezny/i, { timeout: 10000 }),
      addNormalBtnFallback: () =>
        cy
          .contains("span,div,a", /Běžný|Bežný|Bezny/i, { timeout: 10000 })
          .parents("button,[role='button'],a")
          .first(),

      // Dětský
      addKidsBtnDirect: () =>
        cy.contains("button", /Dětský|Detský|Kids/i, { timeout: 10000 }),
      addKidsBtnFallback: () =>
        cy
          .contains("span,div,a", /Dětský|Detský|Kids/i, { timeout: 10000 })
          .parents("button,[role='button'],a")
          .first(),
    },

    // Create profile form
    createProfile: {
      nameInput: () =>
        cy
          .get(
            'input[placeholder*="Jméno"], input[placeholder*="Jmeno"], input[name*="name"], input'
          )
          .first(),
      genderToggle: () =>
        cy
          .contains(".select-toggle,[role='button']", /Pohlaví|Pohlavi|Gender/i)
          .first(),
      yearToggle: () =>
        cy
          .contains(
            ".select-toggle,[role='button']",
            /Rok narození|Rok narozeni|Year/i
          )
          .first(),
      option: (text: string | RegExp) =>
        cy.contains(".select-option,[role='option']", text).first(),
      saveBtn: () =>
        cy.contains("button", /Vytvořit profil|Create profile/i).first(),
    },

    // After save, -> back on the list of profiles
    profilesList: {
      card: (name: string) =>
        cy
          .contains(
            "[role='button'], .profile, .profile-card, button, a",
            name
          )
          .first(),
    },
  };

  // Actions

  
  visit(path: string = "", cookies: boolean = true) {
    cy.visit(this.BASE_URL + path);
    if (cookies) this.acceptCookies();
  }

  
  acceptCookies() {
    this.elements.home.buttonAcceptCookies().click({ force: true });
  }

  /** Login and remain on the “Kdo se dívá?” screen (do NOT enter any profile) */
  login(email: string, password: string) {
    GatewayApi.intercepts.POST_Request();

    this.visit();
    this.elements.home.linkSignIn().click();
    this.elements.login.inputEmail().type(email);
    this.elements.login.inputPassword().type(password);
    this.elements.login.buttonSubmit().click();

    cy.wait("@POST_Request"); // OAuth / SSO RPC finishes
    this.elements.whoIsWatching.heading().should("be.visible");
  }

  /** Click “+ Běžný” on the profile picker screen  */
  openAddNormalProfile() {
    this.openAddProfile("bezny");
  }

  /**
   * Click “+ Běžný” or “+ Dětský” on the profile picker screen
   * @param type 'bezny' | 'detsky'
   */
  openAddProfile(type: "bezny" | "detsky") {
    this.elements.whoIsWatching.heading().should("be.visible");

    if (type === "detsky") {
      cy.get("body").then(($body) => {
        const direct = $body.find(
          'button:contains("Dětský"), button:contains("Detský"), button:contains("Kids")'
        );
        if (direct.length > 0) {
          this.elements.whoIsWatching
            .addKidsBtnDirect()
            .should("be.visible")
            .click({ force: true });
        } else {
          this.elements.whoIsWatching
            .addKidsBtnFallback()
            .should("be.visible")
            .click({ force: true });
        }
      });
    } else {
      cy.get("body").then(($body) => {
        const direct = $body.find(
          'button:contains("Běžný"), button:contains("Bežný"), button:contains("Bezny")'
        );
        if (direct.length > 0) {
          this.elements.whoIsWatching
            .addNormalBtnDirect()
            .should("be.visible")
            .click({ force: true });
        } else {
          this.elements.whoIsWatching
            .addNormalBtnFallback()
            .should("be.visible")
            .click({ force: true });
        }
      });
    }
  }

  /** Fill the New Profile form and submit (Name + Gender + Year required) */
  fillNewProfileForm(name: string) {
    const visibleOptions = '.select-option:visible, [role="option"]:visible';

    // Name
    this.elements.createProfile.nameInput().clear().type(name).blur();

    // Gender – pick the first visible option
    this.elements.createProfile
      .genderToggle()
      .scrollIntoView()
      .click({ force: true });
    cy.get(visibleOptions).first().click({ force: true });

    // Year of birth – pick the first visible option
    this.elements.createProfile
      .yearToggle()
      .scrollIntoView()
      .click({ force: true });
    cy.get(visibleOptions).first().click({ force: true });

    // Create profile
    this.elements.createProfile.saveBtn().should("be.enabled").click({ force: true });
  }

  /** Verify the newly created profile card is visible on the list */
  assertProfileVisible(name: string) {
    this.elements.profilesList.card(name).should("be.visible");
  }
}

export default new IprimaPage();
