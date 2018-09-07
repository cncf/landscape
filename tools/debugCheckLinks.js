import rp from 'request-promise';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const urls = [
"https://www.lunchbadger.com",
"https://www.ghostcloud.cn/products/list/1.html",
"https://container-solutions.com/",
"https://www.ghostcloud.cn/products/list/1.html",
"https://www.lunchbadger.com",
"https://www.binaris.com/",
"https://www.navops.io/",
"https://diamanti.com/product/",
"https://www.ghostcloud.cn/products/list/1.html",
"https://openevents.io/",
"https://www.vertica.com/",
"https://www.starburstdata.com/",
"https://diamanti.com/",
"https://www.daocloud.io/dce",
"https://www.daocloud.io"
];

async function main(url) {
  const r = await rp({
    url: url,
    simple: false,
    resolveWithFullResponse: true,
    followRedirect: false,
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,es;q=0.8,ru;q=0.7',
      'cache-control': 'no-cache',
      dnt: '1',
      pragma: 'no-cache',
      'upgrade-insecure-requests': 1,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'


    }

  });
  console.info(r.statusCode);
}

urls.forEach(function(url) { main(url) });

