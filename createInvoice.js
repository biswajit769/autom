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
    await page.goto(process.env.BASE_URL);
    await page.waitForTimeout(500);
    await page.waitForSelector(constants.USERNAME_SELECTOR);
    await page.click(constants.USERNAME_SELECTOR);
    await page.keyboard.type(`${userid}`);
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