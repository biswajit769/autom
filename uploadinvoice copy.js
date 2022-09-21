const puppeteer = require('puppeteer');
const constants = require('./constants');
const dotenv = require("dotenv");
dotenv.config();

const uploadinvoice = async (invoicedetail) => {
    console.log("inside createGTT method");
    //console.log(user, quantity, company, GTTPrice);
    const browser = await puppeteer.launch({ headless: false });
  // const browser = await puppeteer.launch({
  //   args: [
  //     '--no-sandbox',
  //     '--disable-setuid-sandbox',
  //   ],
  // });
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL);
  await page.waitFor(500);
  await page.waitForSelector(constants.USERNAME_SELECTOR);
  await page.click(constants.USERNAME_SELECTOR);
  await page.keyboard.type(`ripplr@saraloan.in`);
  console.log("username entered");

  await page.waitForSelector(constants.PASSWORD_SELECTOR);
  await page.click(constants.PASSWORD_SELECTOR);
  await page.keyboard.type(`ripplr@saraloan.in`);
  await page.waitFor(1000);
  console.log("password entered");

  await page.waitForSelector(constants.SUBMIT_BUTTON_SELECTOR);
  await page.click(constants.SUBMIT_BUTTON_SELECTOR);
  console.log("submit button clicked");

  await page.waitForSelector(constants.MOBILE_MENU_SELECTOR);
  await page.click(constants.MOBILE_MENU_SELECTOR);
  console.log("mobile menu selector");
  await page.waitFor(500);

  await page.evaluate(() => {
    Array.from(document.querySelectorAll('ul.kt-menu__nav>li>a')).filter(a => {
      return a.innerText == 'Applications' // filter il for specific text
    }).forEach(element => {
      if (element) element.click(); // click on il with specific text
    });
  });
  await page.waitFor(500);

  await page.evaluate(() => {
    Array.from(document.querySelectorAll('ul.kt-menu__subnav>li>a')).filter(a => {
      return a.innerText == 'View All Applications' // filter il for specific text
    }).forEach(element => {
      if (element) element.click(); // click on il with specific text
    });
  });
  await page.waitFor(500);

  await page.waitForSelector(constants.SEARCHBOX_SELECTOR);
  await page.click(constants.SEARCHBOX_SELECTOR,{ clickCount: 2 });
  await page.click(constants.SEARCHBOX_SELECTOR,{ clickCount: 2 });
  await page.keyboard.type(`ABKNG_X5701`);
  await page.waitFor(1000);
  console.log("application id entered");
  await page.keyboard.press('Enter');


  await page.waitForSelector(constants.APPLICATIONID_SELECTOR);
  await page.click(constants.APPLICATIONID_SELECTOR);
  await page.waitFor(500);

};

uploadinvoice();

module.exports = uploadinvoice;