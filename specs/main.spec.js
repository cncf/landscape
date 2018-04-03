import puppeteer from "puppeteer";
const appUrl = "http://localhost:4000";
const width = 1920;
const height = 1080;
let page;
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({});
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

afterAll(() => {
  browser.close();
});

describe("Main test", () => {
  test("I visit a main page and have all required elements", async () => {
    console.info('about to open a page');
    await page.goto(appUrl);
    console.info('page is open');
    //header
    await page.$x("//h1[text() = 'CNCF Cloud Native Interactive Landscape']");
    console.info('header is present');
    //group headers
    await page.$x("//a[contains(text(), 'Graduated CNCF Projects')]");
    console.info('group headers are ok');
    //card
    await page.waitForSelector(".mosaic img[src='/logos/kubernetes.svg']");
    console.info('there is a kubernetes card');
    //click on a card
    await page.click(".mosaic img[src='/logos/kubernetes.svg']");
    console.info('it is clickable');
    //await for a modal
    await page.waitForSelector(".modal-body");
    console.info('modal appears');
  }, 6 * 60 * 1000); //give it up to 1 min to execute
});
