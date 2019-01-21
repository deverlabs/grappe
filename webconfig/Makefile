# Makefile sourced from https://gist.github.com/mpneuried/0594963ad38e68917ef189b4e6a269db

APP_NAME="grape"

PORTS="3000:3000"
APP_VOLUME="$(shell pwd):/usr/src/app"

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

DOCKER_RUN_CMD=docker run -i -t --rm --name=$(APP_NAME) -p=$(PORTS) -v=$(APP_VOLUME) $(APP_NAME)


build: ## Build the container
	docker build -t $(APP_NAME) .

install: ## Install development environment
	@echo "☕  > You can grab a coffee, it will take some time ..."
	docker build -t $(APP_NAME) .
	$(DOCKER_RUN_CMD) yarn install

dev: ## Run development container
	$(DOCKER_RUN_CMD)

attach: ## Attach bash to running container
	docker exec -it $(APP_NAME) bash

shell: ## Start container and attach to bash
	$(DOCKER_RUN_CMD) bash
