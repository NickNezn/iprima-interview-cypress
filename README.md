# Prima+ Interview Task

Fork this repository and complete task.

## Task

Create an end-to-end test for user profile creation.
Output should be repository with setup guide in README.

## Criteria

- **Functionality** - test successfully creates and verifies profile
- **Code Quality** - clean, readable and maintainable code
- **Cleanup** - proper cleanup after test

## Time Limit

Recommended implementation time: **60 minutes**

---

**Good luck! 🚀**


# Prima+ Interview Task

This repository contains an **end-to-end Cypress test** for user profile creation on [iprima.cz](https://www.iprima.cz/).  
The test covers logging in, creating a profile (Běžný or Dětský), verifying its presence, and then cleaning it up to leave the account unchanged.

---

## Features

 **Functionality** – Logs in, creates a profile via UI, and verifies it is visible.  
 **Code Quality** – Organized with Page Object Model (`IprimaPage`) and API helper (`GatewayApi`).  
 **Cleanup** – After the test, the newly created profile(s) are removed using API calls.  
 **Flexibility** – Profile type can be chosen (`Běžný` or `Dětský`) via an environment variable.  

---

## Setup

1. **Install dependencies**
   ```bash
   npm install

2. **Configure credentials**
    Create a cypress.env.json file in the project root: {
  "E2E_EMAIL": "your-email@example.com", you can use mine that i used for testing - neznikn@gmail.com and password Test123456
  "E2E_PASSWORD": "your-password",
  "PROFILE_TYPE": "bezny"
}
PROFILE_TYPE can be:

"bezny" → creates a Běžný profile (default)

"detsky" → creates a Dětský profile

**Running the Tests**

Headless run (default: Běžný) - npm run cy:run

    cy:run:bezny": "cypress run --env PROFILE_TYPE=bezny

    cy:run:detsky": "cypress run --env PROFILE_TYPE=detsky

You can also hard-set it in cypress.env.json by changing PROFILE_TYPE.

**Implementation Notes**

Page Object Model: UI interactions are encapsulated in IprimaPage.

API Integration: GatewayApi is used to fetch and remove profiles (precise cleanup).

Profile Naming: New profiles are prefixed with QA YYYY-MM-DD for uniqueness.

Cleanup Strategy: Compares ULIDs before/after; only new profiles are deleted.

Flexibility: Switch between Běžný and Dětský by changing PROFILE_TYPE.

time limit - took me about 90-120 minutes with setting up enviroment and stuff.
