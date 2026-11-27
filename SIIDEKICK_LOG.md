# Siidekick change log

Siidekick added these patches to your project, oldest first. Each one is saved as `.siidekick/<id>.patch`.
To undo a patch, run its revert command from the project root. Undo the newest first, because a later
patch can build on an earlier one.

## 1. Move 1 hardcoded secret to environment variables

- Patch: `secrets-in-repo-1` from check `secrets-in-repo` (minimal-edit)
- Why: Keys in source are readable by anyone with repo access. After applying, rotate each key with its provider.
- Files: `server.js`, `.env.example`, `.gitignore`
- Revert: `git apply -R .siidekick/secrets-in-repo-1.patch`
- Note: the old secret is masked in the patch file, so the revert puts back the mask, not the key. Treat the key as leaked and rotate it.

## 2. Add security headers middleware

- Patch: `security-headers-1` from check `security-headers` (additive)
- Why: Responses currently ship without clickjacking, MIME-sniffing and referrer protections. This template adds conservative header defaults; risk reduced, not eliminated.
- Files: `security.js`, `server.js`
- Revert: `git apply -R .siidekick/security-headers-1.patch`

## 3. Add a rate limiter to auth endpoints

- Patch: `rate-limit-1` from check `rate-limit` (additive)
- Why: Auth endpoints currently accept unlimited attempts per IP. This template adds an in-memory fixed-window limiter (5 per 15 minutes by default); risk reduced, not eliminated.
- Files: `rateLimit.js`, `server.js`
- Revert: `git apply -R .siidekick/rate-limit-1.patch`

## 4. Restrict CORS to the configured origin

- Patch: `open-cors-1` from check `open-cors` (minimal-edit)
- Why: A wildcard origin lets any site call this API with the visitor's credentials. Each changed line now uses ALLOWED_ORIGIN (default http://localhost:3000); risk reduced as long as that variable is set for every deployment.
- Files: `server.js`
- Revert: `git apply -R .siidekick/open-cors-1.patch`

## 5. Guard admin routes with a bearer-token check

- Patch: `auth-on-endpoints-1` from check `auth-on-endpoints` (additive)
- Why: Admin routes currently accept any caller. This template adds requireAdmin (Bearer token vs ADMIN_TOKEN, 401 otherwise) and mounts it on the admin subtree; risk reduced — swap in a verified Cognito JWT for production.
- Files: `auth.js`, `server.js`
- Revert: `git apply -R .siidekick/auth-on-endpoints-1.patch`

## 6. Bump 2 vulnerable direct dependencies to patched versions

- Patch: `dependency-audit-1` from check `dependency-audit` (minimal-edit)
- Why: Declared ranges currently admit known-vulnerable versions (express → ^4.20.0, lodash → ^4.18.1). The bump is verified only after npm install + tests pass in CI, because the lockfile only refreshes then; risk reduced once a patched version is actually installed.
- Files: `package.json`
- Revert: `git apply -R .siidekick/dependency-audit-1.patch`

## 7. Add siidekick CI workflow

- Patch: `ci-workflow-1` from check `ci-workflow` (additive)
- Why: Runs install, tests, and high-level audit on every push and pull request.
- Files: `.github/workflows/siidekick.yml`
- Revert: `git apply -R .siidekick/ci-workflow-1.patch`

## 8. Add /health route

- Patch: `health-endpoint-1` from check `health-endpoint` (additive)
- Why: Adds a health route so monitoring can verify the app is up.
- Files: `server.js`
- Revert: `git apply -R .siidekick/health-endpoint-1.patch`

## 9. Add error handler middleware

- Patch: `error-handler-1` from check `error-handler` (additive)
- Why: Catches unhandled errors, logs them server-side, and returns a generic 500 to the client.
- Files: `errorHandler.js`, `server.js`
- Revert: `git apply -R .siidekick/error-handler-1.patch`

## 10. Add input validation middleware

- Patch: `input-validation-1` from check `input-validation` (additive)
- Why: Adds a shared validation middleware. Routes still need the owner to wire `validate({...})` into each input-reading route; Siidekick does not edit route files.
- Files: `middleware/validate.js`
- Revert: `git apply -R .siidekick/input-validation-1.patch`

## 11. Add firewall rule templates

- Patch: `firewall-rules-1` from check `firewall-rules` (additive)
- Why: Adds a CloudFormation security group (HTTPS/HTTP ingress, all egress, no SSH) and a UFW script as templates for the owner to review and apply.
- Files: `infra/security-group.yaml`, `infra/ufw.sh`
- Revert: `git apply -R .siidekick/firewall-rules-1.patch`

## 12. Add security incident playbook

- Patch: `incident-playbook-1` from check `incident-playbook` (additive)
- Why: Adds SECURITY_PLAYBOOK.md with five headed response steps so the team knows what to do during a security incident.
- Files: `SECURITY_PLAYBOOK.md`
- Revert: `git apply -R .siidekick/incident-playbook-1.patch`

## 13. Require sign-in in Firebase rules

- Patch: `baas-open-rules-1` from check `baas-open-rules` (minimal-edit)
- Why: Open or test-mode rules let anyone read and write the database from the browser. Each changed rule now requires a signed-in user. Risk reduced, not removed: any signed-in user can still reach other users' data until you add ownership checks.
- Files: `firestore.rules`
- Revert: `git apply -R .siidekick/baas-open-rules-1.patch`

## 14. Reject expired login tokens

- Patch: `jwt-misuse-1` from check `jwt-misuse` (minimal-edit)
- Why: Token verification was told to accept expired tokens, so a leaked token never stops working. Each changed line turns the expiry check back on. Risk reduced, not removed: users whose tokens have expired must sign in again, and decode-only, alg none and hardcoded secrets still need your fix.
- Files: `lib/session-token.js`
- Revert: `git apply -R .siidekick/jwt-misuse-1.patch`
