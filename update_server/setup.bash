# Just some ideas
SERVER_ADDRESS=root@147.75.106.211
nocheck=" -o StrictHostKeyChecking=no "
ssh $nocheck $SERVER_ADDRESS << 'EOSSH'
touch /.cloud-warnings.skip
which git || (
  apt-get update
  apt-get -y install git
)
git config --global user.email "info@cncf.io"
git config --global user.name "CNCF-Bot"
node -v | grep 8.9 || (
  curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
  bash nodesource_setup.sh
  apt-get -y install nodejs
  apt-get -y install build-essential
)
apt-get update
apt-get -y install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

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
  git commit -sm "Automated update by CNCF-bot" && git push origin HEAD
' > /root/real_update.sh
echo '
  set -e
  bash /root/real_update.sh || bash /root/real_update.sh || bash root/real_update.sh
' > /root/update.sh
EOSSH

