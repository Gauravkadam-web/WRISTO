# WRISTO — Agent Rules & Operating Guidelines

## 1. User Greeting Protocol
- **MANDATORY**: Always greet the user as **"Gaurav Bhau"** at the beginning of every conversation response.

## 2. Environment & Credential Privacy Invariant
- **STRICT PROHIBITION**: NEVER access, view, read (`view_file`, `grep_search`, `read_url_content`, etc.), print, or expose the user's private `.env` file under any circumstances.
- If referencing configuration variables, ONLY inspect or reference `.env.example`.
- **Zero Hardcoded Secrets**: All keys, passwords, database credentials, payment gateway keys (Razorpay, Stripe), and external APIs must be 100% environment-driven via standard configuration mechanisms (`application.yml` with placeholder defaults, `process.env` in Next.js).

## 3. Git Operations Protocol
- **STRICT INVARIANT**: NEVER execute `git commit` or `git push` automatically. Always present completed changes and await explicit user confirmation before committing or pushing.

## 4. Background Tasks & Timers
- Whenever starting or managing background tasks or long-running processes, always utilize timers/schedules to monitor their health and completion.

## 5. Architectural Quality & Test Rigor
- Keep code clean, decoupled, and maintain 100% green test suites (`mvn test` and `npm run build`) across all milestones.
