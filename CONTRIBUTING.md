# Contributing

PRs welcome! Here's how to keep things smooth:

## Code style
- TypeScript strict mode
- Zero runtime dependencies (only TypeScript built-ins)
- Edge-runtime compatible (no Node-specific APIs)
- 2-space indent, single quotes, semicolons

## Adding a new language to signals
Open `lib/chat/signals.ts` and extend the `PATTERNS` array. Each entry needs:
- `type`: SignalType (buying_intent, urgency, etc.)
- `regex`: include the language patterns alongside existing ones
- `score`: 0..1

## Adding a new Schema.org type
Open `lib/seo/schema-org.ts` and extend `generateSchemaNodes`. Document the use case in the JSDoc.

## Tests
Add a test in `examples/` showing the use case. We don't enforce coverage but reviewers expect repro-able demos.

## Pull request checklist
- [ ] Code compiles with `tsc --noEmit`
- [ ] Example added to `examples/`
- [ ] README updated if public API changes
- [ ] No `console.log` left over
