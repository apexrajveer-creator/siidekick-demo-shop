# Security Incident Playbook — @siidekick/vulnerable-app

## Detect
- Confirm the alert: which endpoint or log triggered it, and when.
- Review recent deploys and changed files in git.
- Identify affected users and any exposed data.
- Record the time, source, and scope of the event.

## Contain
- Rotate any exposed keys and revoke all active sessions immediately.
- Block offending IPs at the firewall or WAF.
- Take the affected route offline if data is being exfiltrated.

## Eradicate
- Check access and error logs for how the attacker got in.
- Remove malicious code and revert to a clean, signed git commit.
- Patch the dependency or code path that allowed the issue.

## Recover
- Redeploy from git (`git checkout <clean-sha>` then push).
- Restart the Node/Express service and verify it responds on /health.
- Confirm logs show clean traffic after the redeploy.

## Review
- Write a postmortem: what happened, what changed, how long response took.
- Notify users if their data was affected.
- Add a check or test so the same issue cannot recur.
