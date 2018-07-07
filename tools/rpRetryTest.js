import rp from './rpRetry';
async function main() {
  const result = await rp({
    url: 'http://google.com',
    verbose: true,
    timeout: 30000
  });
  console.info(result);
}
main();
