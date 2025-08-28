import Page from '../page/IprimaPage';
import Api from '../api/GatewayApi';

describe('User profile creation (E2E)', () => {
  const email = Cypress.env('E2E_EMAIL');
  const password = Cypress.env('E2E_PASSWORD');

  // Choose which profile to create: 'bezny' (default) or 'detsky'
  const profileType: 'bezny' | 'detsky' =
    (Cypress.env('PROFILE_TYPE') || 'bezny').toLowerCase();

  const profileName = `QA ${new Date().toISOString().slice(0, 10)}`; // profile name will be QA and current date

  let beforeUlids: string[] = [];
  let createdUlids: string[] = [];

  before(() => {
    if (!email || !password) {
      throw new Error('Missing E2E_EMAIL/E2E_PASSWORD. Please add them to cypress.env.json.');
    }

    // Snapshot existing profiles for precise cleanup
    return Api.getProfileUlIds(email, password).then((ids: any) => {
      beforeUlids = ids;
    });
  });

  it('creates a new profile via UI and verifies it', () => {
    // 1) Login and land on "Kdo se dívá?" screen
    Page.login(email, password);

    // 2) Add new profile of the selected type (+ Běžný or + Dětský)
    Page.openAddProfile(profileType);

    // 3) Fill form and save
    Page.fillNewProfileForm(profileName);

    // 4) Verify UI
    Page.assertProfileVisible(profileName);
    cy.url().should('match', /\/profily\/?$/);

    // 5) Record the ULID(s) created for targeted cleanup
    return Api.getProfileUlIds(email, password).then((after: any) => {
      createdUlids = after.filter((id: string) => !beforeUlids.includes(id));
      expect(createdUlids.length, 'new profiles created').to.be.greaterThan(0);
    });
  });

  after(() => {
    // Remove only what was created
    if (!createdUlids.length) return;

    createdUlids.forEach((ulid) => {
      Api.removeProfile(ulid, email, password);
    });

    // verify deletion
    Api.getProfileUlIds(email, password).then((ids: any) => {
      createdUlids.forEach((ulid) => expect(ids).to.not.include(ulid));
    });
  });
});
