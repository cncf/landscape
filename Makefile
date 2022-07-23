serve:
	./server.js

build-docker:
	docker build -t cncf/landscape .

serve-docker: build-docker
	docker run -ti --rm -p 8001:8001 cncf/landscape
