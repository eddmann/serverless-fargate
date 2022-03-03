IMAGE = node:12-alpine3.15
DOCKER = docker run --rm -v $(PWD):/app -w /app

.PHONY: install
install:
	@$(DOCKER) $(IMAGE) yarn install --immutable

.PHONY: test
test:
	@$(DOCKER) $(IMAGE) yarn test

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) sh
