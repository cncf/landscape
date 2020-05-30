. ~/.nvm/nvm.sh
npm pack interactive-landscape@cncf/landscapeapp#75-weekly-2020-05-30
tar xzf interactive*
cd package
cp -r ../node_modules .
nvm install `cat .nvmrc`
nvm use `cat .nvmrc`
npm install -g npm
npm install
cp -r node_modules/* ../node_modules
PROJECT_PATH=../.. npm run build
