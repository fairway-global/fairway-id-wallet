# Test Suite Documentation

This directory contains comprehensive test suites for the Fairway ID Wallet, covering all components described in the testing report.

## Test Files

### 1. `fayda-integration.test.tsx`
Tests for Fayda (Ethiopian National ID) integration:
- **FAY-001 to FAY-012**: Login flow, authentication, callback handling, token exchange, userinfo retrieval, and security features
- Covers PKCE flow, authorization requests, and user profile display

### 2. `api-endpoints.test.ts`
Tests for API route handlers:
- **API-001 to API-004**: Token exchange endpoint, UserInfo endpoint, error handling, and request validation
- Tests `/api/token` and `/api/userinfo` endpoints

### 3. `wallet-core.test.ts`
Tests for Identus-based wallet core functionality:
- **WAL-001 to WAL-012**: Wallet setup, mnemonic generation, credential management, DID creation, and storage
- Covers wallet initialization, recovery, and credential operations

### 4. `ui-components.test.tsx`
Tests for user interface components:
- **UI-001 to UI-009**: Dashboard, navigation, credential display, and responsive design
- Tests credential components for Identity, Education, and Work credentials

### 5. `security.test.ts`
Tests for security features:
- **SEC-001 to SEC-004**: Data encryption, session management, key protection, and token expiration
- Covers CSRF protection and PKCE implementation

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test fayda-integration
npm test api-endpoints
npm test wallet-core
npm test ui-components
npm test security
```

## Test Coverage

The test suite covers:
- ✅ 12 Fayda Integration tests
- ✅ 12 Wallet Core tests
- ✅ 9 UI Component tests
- ✅ 7 API Endpoint tests
- ✅ 4 Security tests

**Total: 44+ test cases** matching the testing report requirements.

## Test Structure

Each test file follows this structure:
1. **Test Description**: Matches test IDs from TESTING_REPORT.md
2. **Setup**: Mocks and test data preparation
3. **Test Cases**: Individual test scenarios
4. **Assertions**: Verification of expected behavior

## Mocking

Tests use mocks for:
- Next.js router (`next/navigation`)
- Axios HTTP requests
- Identus SDK components
- Browser APIs (localStorage, sessionStorage, crypto)
- Toast notifications

## Notes

- Tests are designed to be independent and can run in any order
- All async operations use proper `waitFor` and `await` patterns
- Mock data is reset between tests to ensure isolation
- Tests match the acceptance criteria from the testing report

## Troubleshooting

### Tests failing due to module resolution
Ensure TypeScript path mappings are correctly configured in `tsconfig.json`.

### Mock issues
Check that `jest.setup.js` properly configures all required mocks.

### Environment variables
Some tests require environment variables. Set up a `.env.test` file if needed.

## Continuous Integration

These tests are designed to run in CI/CD pipelines. Ensure all test dependencies are installed and environment variables are configured.

