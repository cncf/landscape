import puppeteer from "puppeteer";
const appUrl = "localhost:4000";
const width = 1920;
const height = 1080;
let page;
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

afterAll(() => {
  browser.close();
});

describe("Main test", () => {
  test("I visit a main page and have all required elements", async () => {
    await page.goto(appUrl);
    //header
    await page.$x("//h1[text() = 'CNCF Cloud Native Interactive Landscape']");
    //group headers
    await page.$x("//a[contains(text(), 'Graduated CNCF Projects')]");
    //card
    await page.waitForSelector(".mosaic img[src='/logos/kubernetes.svg']");
    //click on a card
    await page.click(".mosaic img[src='/logos/kubernetes.svg']");
    //await for a modal
    await page.waitForSelector(".modal-body");
  }, 60000); //give it up to 1 min to execute
});
