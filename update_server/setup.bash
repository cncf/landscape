# Just some ideas
SERVER_ADDRESS=root@147.75.106.211
nocheck=" -o StrictHostKeyChecking=no "
ssh $nocheck $SERVER_ADDRESS << 'EOSSH'
touch /.cloud-warnings.skip
which git || (
  apt-get update
  apt-get -y install git
)
git config --global user.email "l-2732@ya.ru"
git config --global user.name "CNCF-Bot"
node -v | grep 8.9 || (
  curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
  bash nodesource_setup.sh
  apt-get -y install nodejs
  apt-get -y install build-essential
)
which yarn || (
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  apt-get update && apt-get -y install yarn
)
echo '
0 0 * * * root bash -l -c "bash /root/update.sh >> /root/update.log"
' > /etc/cron.d/updater
echo '
  set -e
  export HOME=/root
  . /etc/profile
  rm -rf /repo
  git clone https://$GITHUB_USER:$GITHUB_TOKEN@github.com/cncf/landscape /repo
  cd /repo
  yarn
  LEVEL=medium yarn fetch || echo "yarn failed"
  git add . || echo "nothing to add"
  git config --global user.email "info@cncf.io"
  git config --global user.name "CNCF-bot"
  (git commit -m "Automated update by CNCF-bot" && git push origin HEAD) || echo "can not commit"
  sleep 3600
' > /root/update.sh
EOSSH

