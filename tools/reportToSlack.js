import rp from 'request-promise';

const url = `https://hooks.slack.com/services/${process.env.SLACK_CHANNEL}`;
console.info(process.env.ERROR_STATUS);
const errorStatus = process.env.ERROR_STATUS === '0' ? 'SUCCESS' : 'FAILURE'
const payload = {
  text: `Update from ${new Date().toISOString()} finished with ${errorStatus}`,
  attachments: [{
    title: 'Log File: (update.log)',
    text: require('fs').readFileSync(process.env.LOGFILE_PATH, 'utf-8')
  }]
};

async function main() {
  const result = await rp({
    method: 'POST',
    json: payload,
    url: url
  });
  console.info(result);

}
main();
