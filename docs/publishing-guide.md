# Publishing Guide

This is your personal guide for publishing and maintaining canvas-forge.

## First-Time Setup

### 1. Create the GitHub Repository

```bash
# Navigate to your project folder
cd canvas-forge

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial release of canvas-forge v1.0.0"

# Add remote
git remote add origin https://github.com/jersuxsss/canvas-forge.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Create an NPM Access Token

1. Go to [npmjs.com](https://www.npmjs.com/) and log in as `jersuxs`
2. Click your avatar (top right) → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Choose **Automation** type (for CI/CD) or **Publish** (for manual publishing)
5. Copy the token — you'll need it in the next step

### 3. Add NPM Token to GitHub Secrets (for auto-publish)

1. Go to `github.com/jersuxsss/canvas-forge` → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste your NPM token
5. Click **Add secret**

## Publishing Manually

```bash
# Make sure everything works first
npm run lint
npm run typecheck
npm test
npm run build

# Verify what will be published
npm pack --dry-run

# Log in to NPM (if not already)
npm login

# Publish!
npm publish
```

## Publishing via GitHub Release (Recommended)

Once you've set up the `NPM_TOKEN` secret, publishing is automatic:

1. Go to your GitHub repo → **Releases** → **Create a new release**
2. Create a new tag (e.g., `v1.0.0`)
3. Add release notes (you can use the CHANGELOG.md content)
4. Click **Publish release**
5. The GitHub Action will automatically build, test, and publish to NPM!

## Updating Versions

```bash
# Patch version (1.0.0 → 1.0.1) - Bug fixes
npm version patch

# Minor version (1.0.0 → 1.1.0) - New features
npm version minor

# Major version (1.0.0 → 2.0.0) - Breaking changes
npm version major
```

After running `npm version`, push the tag:

```bash
git push origin main --tags
```

Then create a GitHub Release from that tag.

## Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Spotify card builder
fix: fix progress bar rendering at 0%
docs: update rank card documentation
test: add tests for color utilities
chore: update dependencies
refactor: simplify BaseCanvas _renderBackground
```

## Checklist Before Each Release

- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped (`npm version <patch|minor|major>`)
- [ ] Git tag is pushed
- [ ] GitHub Release is created with release notes
