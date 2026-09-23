.PHONY: setup hooks test test:e2e

setup: hooks
	@echo "Hooks installed. Next: npm i && npx playwright install chromium"

hooks:
	bash scripts/install-hooks.sh

test:
	npm run typecheck && npm run test:unit

test:e2e:
	npm run test:e2e
