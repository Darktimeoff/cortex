# My Express V2 Library

A modern express v2 

## Installation

```bash
pnpm add my-ts-library
# or
npm install my-ts-library
# or
yarn add my-ts-library
```

## Usage

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