REMOTE=melodyn@51.250.0.137
DIR_BACKEND=/home/melodyn/webinar/backend
#PM2=/home/melodyn/.asdf/shims/pm2

setup: install-dependencies run
install-dependencies:
	npm ci

# app
run: mongo-run
	npm run dev

# dev
lint:
	npm run lint
mongo-run:
	docker run --rm -p 27017:27017 -d --name mongo mongo:latest || true
mongo-stop:
	docker stop mongo

release: build deploy
build:
	rsync -a --exclude node_modules . ./build
	cd build && NODE_ENV=production npm ci
deploy:
#	ssh $(REMOTE) 'cd $(DIR_BACKEND) && make pm2-stop'
	rsync -avz --progress -e 'ssh' ./build/ $(REMOTE):$(DIR_BACKEND)
#	ssh $(REMOTE) 'cd $(DIR_BACKEND) && make pm2-prod'
remote:
	ssh $(REMOTE)
