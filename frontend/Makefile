REMOTE=melodyn@51.250.0.137
DIR_FRONTEND=/home/melodyn/webinar/frontend

setup: install-dependencies run
install-dependencies:
	npm ci

lint:
	npx stylelint "./src/**/*.css"
	npx eslint --ext .js,.jsx ./src

run:
	npm run start

build:
	npm run build

ci-build:
	NODE_ENV=development CI=false make install-dependencies
	NODE_ENV=production CI=true make build

release: build deploy
deploy:
	rsync -avz --progress -e 'ssh' build/ $(REMOTE):$(DIR_FRONTEND)
remote:
	ssh $(REMOTE)

