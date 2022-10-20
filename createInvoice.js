const puppeteer = require('puppeteer');
const constants = require('./constants');
const dotenv = require("dotenv");
const fs = require('fs');
const storagefolder = __dirname + '/uploads';
const {formatDate} = require('./helper');
dotenv.config();

const createInvoice = async (invdetail, {userid, password}) => {
  try{
   // var browser = await puppeteer.launch({ headless: false });
    var browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    const page = await browser.newPage();
    await page.goto('https://web.saraloan.in/auth/login');
    // await page.waitFor(500);
    // await page.waitForSelector(constants.USERNAME_SELECTOR);
    // await page.click(constants.USERNAME_SELECTOR);
    // await page.keyboard.type(`${userid}`);
    

    // Type into search box.
    await page.type(constants.USERNAME_SELECTOR, userid);
    console.log("username entered");
    await browser.close();
    return 'success'; 
  }catch(error){
    await browser.close();
    console.log(error);
    return 'fail';
  }
  
};

module.exports = createInvoice;