# ByteShrink CLI

A simple command-line tool to analyze your `package.json` for bundle size and performance improvements using ByteShrink AI.

## Usage

```bash
npx @byteshrink/cli ./package.json
```

Or install globally:

```bash
npm install -g @byteshrink/cli
byteshrink ./path/to/package.json
```

## Development

```bash
npm install
npm run dev
```

## Example Output

```
╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                                           │
│   # Bundle Size and Performance Optimization Suggestions                                                                  │
│                                                                                                                           │
│   ## 📦 Dependency Analysis                                                                                               │
│                                                                                                                           │
│   ### **1. Heavy Packages with Lighter Alternatives**                                                                     │
│   - **`boxen` (7.1.1)**                                                                                                   │
│     - **Issue**: Relatively large (~1MB) for terminal box formatting.                                                     │
│     - **Alternative**: Use `cli-boxes` (8kB) or `terminal-kit` for lighter box rendering.                                 │
│                                                                                                                           │
│   - **`chalk` (5.4.1)**                                                                                                   │
│     - **Issue**: Adds ~18kB (minified) for terminal styling.                                                              │
│     - **Alternative**: Switch to `kleur` (3kB) or `picocolor` (1kB) for similar functionality with zero dependencies.     │
│                                                                                                                           │
│   - **`node-fetch` (3.3.2)**                                                                                              │
│     - **Issue**: Unnecessary if using Node.js ≥18.x (native `fetch` is built-in).                                         │
│     - **Action**: Remove `node-fetch` and use native `fetch` if possible.                                                 │
│                                                                                                                           │
│   ### **2. Outdated Packages**                                                                                            │
│   - **`zod` (3.25.51)**                                                                                                   │
│     - **Latest Version**: 3.22.4 (confirm with `npm view zod version`).                                                   │
│     - **Action**: Update to the latest version for performance improvements and smaller bundle size.                      │
│                                                                                                                           │
│   ### **3. DevDependencies**                                                                                              │
│   - **`@types/node` (22.15.29)**                                                                                          │
│     - **Latest Version**: Align with your Node.js version (e.g., `@types/node@20` for Node 20).                           │
│   - **`typescript` (5.8.3)**                                                                                              │
│     - **Latest Version**: 5.4.5 (confirm with `npm view typescript version`). Newer versions include optimizations.       │
│                                                                                                                           │
│   ---                                                                                                                     │
│                                                                                                                           │
│   ## 🛠️ General Recommendations                                                                                           │
│                                                                                                                           │
│   ### **Bundle Size Reduction**                                                                                           │
│   - **Use a Bundler**: Tools like `esbuild` or `swc` can minify and tree-shake unused code.                               │
│   - **Audit Dependencies**: Run `npm ls --prod` to identify unused packages.                                              │
│   - **Prefer ESM over CJS**: Modern ESM imports allow better tree-shaking.                                                │
│                                                                                                                           │
│   ### **Install Footprint**                                                                                               │
│   - **Trim Unused Packages**: Use `depcheck` to find unused dependencies.                                                 │
│   - **Lock Dependency Versions**: Avoid overly broad version ranges (e.g., `^`) to prevent accidental bloat.              │
│                                                                                                                           │
│   ---                                                                                                                     │
│                                                                                                                           │
│   ## 📊 Expected Savings                                                                                                  │
│   | Action                   | Size Reduction |                                                                           │
│   |--------------------------|----------------|                                                                           │
│   | Replace `boxen`          | ~990kB         |                                                                           │
│   | Replace `chalk`          | ~15-17kB       |                                                                           │
│   | Remove `node-fetch`      | ~1.2MB         |                                                                           │
│   | Update `zod`/TypeScript  | Varies (5-10%) |                                                                           │
│                                                                                                                           │
│   ---                                                                                                                     │
│                                                                                                                           │
│   **Next Steps**:                                                                                                         │
│   1. Run `npm outdated` to check for updates.                                                                             │
│   2. Test lighter alternatives in a development environment.                                                              │
│   3. Use `npm audit` to resolve vulnerabilities.                                                                          │
│                                                                                                                           │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
