# My TypeScript Library

A modern TypeScript library with utility functions and type definitions.

## Installation

```bash
pnpm add my-ts-library
# or
npm install my-ts-library
# or
yarn add my-ts-library
```

## Usage

```typescript
import { isNil, delay, formatCurrency } from 'my-ts-library';
import type { Person, LibraryConfig, Status, Result } from 'my-ts-library';

// Check if a value is nil
console.log(isNil(null)); // true
console.log(isNil(undefined)); // true
console.log(isNil(0)); // false

// Format currency
console.log(formatCurrency(1234.56)); // $1,234.56
console.log(formatCurrency(1234.56, 'de-DE', 'EUR')); // 1.234,56 €

// Delay execution
async function example() {
  console.log('Start');
  await delay(1000); // wait for 1 second
  console.log('End');
}

// Use type definitions
const person: Person = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
};

const config: LibraryConfig = {
  apiKey: 'your-api-key',
  timeout: 5000,
  debug: true
};

const status: Status = 'loading';

const result: Result<string> = {
  status: 'success',
  data: 'Operation completed successfully'
};
```

## Features

- Type-safe utilities
- Modern TypeScript support
- Fully tested with Jest
- Tree-shakable exports
- TypeScript declaration files
- Fast linting with Oxlint
- pnpm for efficient package management

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/my-ts-library.git
cd my-ts-library

# Install dependencies
pnpm install
```

### Scripts

- `pnpm build` - Build the library
- `pnpm clean` - Remove build artifacts
- `pnpm lint` - Lint the codebase with Oxlint
- `pnpm test` - Run tests
- `pnpm commit` - Create a formatted commit using Commitizen

### Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to ensure consistent commit messages. Instead of using `git commit` directly, use:

```bash
pnpm commit
```

This will guide you through creating a properly formatted commit message:

1. Select the type of change (feat, fix, docs, etc.)
2. Enter the scope (optional)
3. Write a short description
4. Provide a longer description (optional)
5. Mention breaking changes (if any)
6. Reference issues (if any)

#### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

## License

MIT 