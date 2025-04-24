# Publishing Guide for HELSE Forward

This document provides instructions for publishing the HELSE Forward package (@dem1989/forward) to npm.

**Current published version: 0.1.0**

## Prerequisites

Before publishing, make sure you have:

1. An npm account (create one at https://www.npmjs.com/signup if you don't have one)
2. Logged in to npm on your local machine
3. Proper access rights to publish under the `@dem1989` scope (automatic for your own user scope)

## Preparing for Publication

1. **Update Version Number**

   Before publishing, update the version number in `package.json` according to [Semantic Versioning](https://semver.org/) principles:

   ```bash
   # For a patch release (bug fixes)
   npm version patch

   # For a minor release (new features, backward compatible)
   npm version minor

   # For a major release (breaking changes)
   npm version major
   ```

2. **Run Tests and Build**

   Make sure all tests pass and the build is successful:

   ```bash
   npm run test
   npm run build
   ```

   Or use the prepublish script that does both:

   ```bash
   npm run prepublishOnly
   ```

3. **Check Package Contents**

   Review what will be included in the published package:

   ```bash
   npm pack --dry-run
   ```

## Publishing to npm

1. **Login to npm**

   If you haven't already, log in to npm:

   ```bash
   npm login
   ```

   Enter your username, password, and email when prompted.

2. **Publish the Package**

   ```bash
   npm publish
   ```

   Since the package.json includes `"publishConfig": { "access": "public" }`, the package will be published with public access.

3. **Verify Publication**

   After publishing, verify that your package is available on npm:

   ```bash
   npm view @dem1989/forward
   ```

   You can also check the npm website: https://www.npmjs.com/package/@dem1989/forward

## Publishing a New Version

To publish a new version:

1. Make your changes and commit them
2. Update the version number using `npm version`
3. Run tests and build
4. Publish the new version

```bash
# Example workflow for a patch update
git add .
git commit -m "Fix: description of the changes"
npm version patch
npm publish
```

## Unpublishing

If you need to unpublish a version (within 72 hours of publishing):

```bash
npm unpublish @dem1989/forward@x.y.z
```

Replace `x.y.z` with the specific version you want to unpublish.

**Note:** npm has restrictions on unpublishing packages. See the [npm unpublish policy](https://docs.npmjs.com/policies/unpublish) for details.

## Deprecating a Version

If a version should no longer be used but you don't want to unpublish it:

```bash
npm deprecate @dem1989/forward@x.y.z "This version is deprecated. Please use version x.y.z instead."
```

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)
