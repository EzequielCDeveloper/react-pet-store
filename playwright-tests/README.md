# Playwright Test Suite

This directory contains the end-to-end (E2E) and API tests for the Pet Store application, powered by **Playwright**.

## 📁 Directory Structure

```
playwright-tests/
├── api/            # API tests and Zod schemas
│   ├── pet-api.spec.ts    # Tests for Pet API endpoints
│   └── schemas.ts         # Zod schemas for runtime validation
├── fixtures/       # Test data and fixtures
│   └── mock-data.ts       # Shared mock data for UI tests
├── pages/          # Page Object Models (POM)
│   ├── BasePage.ts        # Shared base class
│   ├── HomePage.ts        # Home page interactions
│   ├── CheckoutPage.ts    # Checkout page interactions
│   └── ...
├── ui/             # UI tests using Network Mocking
│   ├── home.spec.ts       # Home page UI tests
│   └── checkout.spec.ts   # Checkout flow tests
└── README.md       # This file
```

## 🚀 Running Tests

### Prerequisites
Playwright is configured to automatically build and start the production preview server (`npm run preview`) on port 4173.
No manual server startup is required.

If you prefer to run the server manually:
```bash
npm run build
npm run preview
```
(Note: The default `npm run dev` starts on port 5173, but Playwright is configured for 4173. If you use dev server, update `playwright.config.ts`.)

### Run All Tests
```bash
npx playwright test
```

### Run UI Tests Only
```bash
npx playwright test --project=chromium --grep "@ui" 
# (Note: You might need to add @ui tags to descriptions if you want to filter by tag, 
# or just run specific files)
npx playwright test ui/
```

### Run API Tests Only
```bash
npx playwright test api/
```

### View Report
```bash
npx playwright show-report
```

## 🛠️ Key Concepts

### 1. Page Object Model (POM)
We use the POM pattern to encapsulate page-specific logic and selectors. This makes tests readable and maintainable.
-   **`BasePage`**: Contains common methods like `navigate` and `waitForUrl`.
-   **Specific Pages**: Extend `BasePage` and expose high-level actions like `addToCart` or `fillForm`.

### 2. Network Mocking
UI tests (`ui/`) use `page.route()` to intercept network requests. This ensures:
-   **Determinism**: Tests always receive the same data (from `fixtures/mock-data.ts`).
-   **Speed**: No real network calls to the backend.
-   **Isolation**: UI tests pass even if the backend is down.

### 3. Zod Schema Validation & Negative Testing
API tests (`api/`) use **Zod** to validate the structure of API responses.
-   **Positive Validation**: Ensures the API returns the expected data shape.
-   **Negative Validation**: Explicitly constructs invalid data objects and asserts that the schema correctly rejects them (e.g., verifying that `PetSchema.safeParse(invalidData)` returns `success: false`).
-   See `api/schemas.ts` for definitions and `api/pet-api.spec.ts` for implementation.

## 🤖 CI/CD Integration
Tests are configured to run on GitHub Actions.
-   **Workflow**: `.github/workflows/playwright.yml`
-   **Triggers**: Push/PR to `main` or `master`
-   **Steps**:
    1.  Checkout code
    2.  Install Node.js & dependencies
    3.  Install Playwright browsers
    4.  Run tests (`npx playwright test`)
    5.  Upload HTML report as artifact

## 🤝 Contributing
1.  Add new page interactions to the appropriate file in `pages/`.
2.  Define new Zod schemas in `api/schemas.ts` if testing new endpoints.
3.  Add negative test cases for robust schema validation.
4.  Use `fixtures/mock-data.ts` to keep test data consistent.
