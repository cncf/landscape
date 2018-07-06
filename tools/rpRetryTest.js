import rp from './rpRetry';
async function main() {
  await rp({
    url: 'http://google.com',
    verbose: true,
    timeout: 30000
  });
}
main();
