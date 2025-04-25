# Technical Assessment for QA Engineer at Ranger

## Overview

In this exercise, you will work with Playwright (written in TypeScript) to create and complete three automated tests for Wikipedia.

You’ll start by implementing a login test from scratch, then finish two existing tests that were partially generated using Ranger’s test recorder and code generation tool.

You have one hour to complete this exercise on your own. When the hour is up, your interviewer will rejoin the call to discuss your work. You’ll walk them through what you accomplished, highlight what went well, and note any improvements you would have made with additional time.

## Your Task

1. Implement a login test and capture the storage state so the remaining tests run as a logged in user
    - In `login.test.ts`, create a test that signs into Wikipedia
    - Create an account if you don't already have one
    - Add your sign in credentials to `.env`
2. Complete the Wikipedia search test
    - In `searchWikipedia.ts`, finish the existing test so that it correctly implements the test case in the file
3. Complete the Wikipedia home page actions test
    - In `wikipediaHomepageActions.ts`, finish the existing test so that it correctly implements the test case in the file

Each test file contains more detailed instructions.

Make sure that the only files that you edit are `login.test.ts`, `searchWikipedia.ts`, and `wikipediaHomepageActions.ts`.

## Project Structure

```plaintext
├── README.md
├── package.json
├── package-lock.json
├── playwright.config.ts
├── .env
└── src
    └── lib
        ├── all.test.ts
        ├── login.test.ts
        ├── cassettes/
        │   └── wikipedia_homepage.json
        ├── pages/
        │   └── home_page.ts
        ├── tests
        │   ├── searchWikipedia.ts
        │   └── wikipediaHomepageActions.ts
        └── utils
            └── testHelpers.ts
    └── auth
        └── login.json
```

## Setup

### Requirements

-   Node.js v22+
-   npm

### Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

#### Run all tests

There's a `test` script in `package.json` so you can do:

```bash
npm run test
```

#### Run a specific test

Add `.only` to the specific test you want to run in isolation in `all.test.ts` and then run the same command:

```bash
npm run test
```

## Need Help?

If you run into any technical issues during the assessment, do your best to unblock yourself. If you really cannot proceed or are done with the task, email megan@ranger.net.

## Implementation Details

### Technical Assessment Walkthrough

[Loom video](https://www.loom.com/share/640a2a76c94b4b9c8718258ec1da03d4?sid=782af4cc-680e-4d2d-bb74-c781c3f4ded7)

### Wikipedia Homepage Actions Test Implementation
- Implemented the homepage actions test in `wikipediaHomepageActions.ts` featuring:
  - Page Object Model pattern with `WikipediaHomePage` class
  - Accurate article count verification
  - Text size manipulation tests (Small, Large, Standard)
  - Precise font size measurements and assertions
  - Proper test step organization for better readability
  - Comprehensive logging for debugging purposes

### Login Test Implementation
- Created a robust login test in `login.test.ts` that:
  - Uses environment variables for secure credential management
  - Implements proper error handling for missing credentials
  - Successfully authenticates and captures the storage state
  - Verifies successful login through multiple assertions
  - Saves authentication state to `src/auth/login.json` for reuse

### Wikipedia Search Test Implementation
- Completed the search test in `searchWikipedia.ts` with:
  - Proper navigation to the Wikipedia search page
  - Accurate search functionality for "artificial intelligence"
  - Comprehensive assertions for page title and content
  - Verification of the history page and latest editor
  - Clear diagnostic messages for test failures

### Test Infrastructure
- Set up proper test environment with:
  - VCR-like functionality for consistent test runs
  - Proper test helpers and utilities
  - Organized page objects for better maintainability
  - Comprehensive test reporting
