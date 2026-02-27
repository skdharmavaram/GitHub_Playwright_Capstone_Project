# GitHub Playwright Capstone Project

This repository contains a Playwright-based UI automation suite targeting the GitHub web interface. The tests exercise a typical user workflow: logging in, navigating repositories, creating new repository, and creating a new file.

## Test Suite Overview

The primary suite lives in `tests/GitHubUiAutomationTestCopy_3.spec.js` and executes in serial mode. Current test cases include:

1. **TC‑00** – Initialize browser context and page
2. **TC‑01** – Authenticate with valid credentials
3. **TC‑02** – Confirm dashboard visibility post-login
4. **TC‑03** – Navigate to the Repositories page
5. **TC‑04** – Open the *My Repositories* section
6. **TC‑05** – *(skipped)* Locate a specific repository
7. **TC‑06** – Go to the *Create New Repository* page
8. **TC‑07** – Enter details and create a new repository
9. **TC‑08** – Navigate to the *Create New File* page
10. **TC‑09** – *(skipped)* Add file details and commit the file

A separate invalid-login test (`tests/GitHubUiAutomation_InvalidLogin.spec.js`) captures failure behavior with video recording. video recordings are stored in the default Playwright output directory.

A spearate GitHub API UI Integration test implemented (`tests/GitHubAPIUI_e2e_Integration.spec.js`) which is showcases an API-driver test setup and teardown strategy combined with UI-based validation to ensure backend and frontend consistency. It follows a modular architecture with Playwright request fixtures, dynamic test data generation, and clean environment management. 

Additional experiment suites were added to explore global storage state and reduced case sets:
- `tests/GitHubUiTest.spec.js` – pared-down tests of GitHub page
- `tests/GitHubUiAutomationTest_2.spec.js` & `tests/GitHubUiAutomationTest.spec.js` – global login state approaches where I observed that we need to do some modifications in current pages and test, hence I decided do it in seperate project. 

Note: Credentials are secured in a `.env` file (ignored via `.gitignore`).


## Page Object Model

The project follows the Page Object Model to encapsulate UI interactions:
- **`LoginPage.js`** – login functionality.
- **`HomePage.js`** –  validates navigation and dashboard visibility.
- **`MyRepositoriesPage.js`** –  handles repository navigation and lookup.
- **`NewRepoCreationPage.js`** – manages repository creation, including
visibility dropdown interactions.
- **`NewRepoHomePage.js`** – covers file creation and commit flows.

## Key Challenges & Resolutions

1. *Locator discovery* - Identifying reliable selectors on a dynamic site.
2. *Environment configuration* - user ID and password are read from .env for security.
2. *Authentication flow*:
   - Two-factor authentication appeared after the first login; automation was postponed to avoid disrupting other work.
3. *New Repository Creation* - included assertions and unique screenshots (`Date.now()` used for filenames).
4. *Repository navigation* - Repository navigation and verification were abstracted into page objects.
5. *Visibility dropdown issue* during repo creation led to separate methods and explicit waits for stability.
6. Additional page objects were created as new scenarios were automated.

## Notes

The suite continues to evolve. Current efforts focus on global storage state and improving maintainability without sacrificing reliability.