. ~/.nvm/nvm.sh
npm pack interactive-landscape@latest
tar xzf interactive*
cd package
cp -r ../node_modules .
nvm use `cat .nvmrc`
npm install -g npm
npm install
cp -r node_modules/* ../node_modules
PROJECT_PATH=../.. npm run build
