const puppeteer = require('puppeteer');
const constants = require('./constants');
const dotenv = require("dotenv");
const storagefolder = __dirname + '/uploads';
const {formatDate} = require('./helper');
dotenv.config();
async function uploadinvoice({applicationId, invoiceNo, invoiceDate, netpayble},{userid, password},fileName) {
  invoiceDate = await formatDate(invoiceDate);
  console.log("applicationId=",applicationId,"invoiceNo=",invoiceNo,"invoiceDate=",invoiceDate,"netpayble=",netpayble,"fileName=",fileName);
  try {
    //var browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    const page = await browser.newPage();
    
    await page.waitForTimeout(5000);
    await page.setViewport({ width: 1440, height: 788 });
    await page.waitForTimeout(5000);
    await page.goto(process.env.BASE_URL);
    await page.waitForTimeout(5000);
    await page.waitForSelector(constants.USERNAME_SELECTOR);
    await page.click(constants.USERNAME_SELECTOR);
    await page.keyboard.type(userid);
    await page.waitForTimeout(5000);
    await page.waitForSelector(constants.PASSWORD_SELECTOR);
    await page.click(constants.PASSWORD_SELECTOR);
    await page.keyboard.type(password);
    await page.waitForTimeout(5000);
    await page.waitForSelector(constants.SUBMIT_BUTTON_SELECTOR);
    await page.click(constants.SUBMIT_BUTTON_SELECTOR);
    // await page.type("#mat-input-0", userid);
    // await page.type("#mat-input-1", password);
    // await page.click("#kt_login_signin_submit");
    await page.waitForTimeout(5000); // wait for 5 seconds
    console.log("login completed",applicationId);
    //await browser.close();

    await page.waitForSelector('#kt_header_menu > ul > li:nth-child(3) > a',{timeout: 60000});
    await page.click('#kt_header_menu > ul > li:nth-child(3) > a');
    await page.waitForTimeout(5000); // wait for 5 seconds
    console.log("header menu selection completed",applicationId);

    await page.waitForSelector('#kt_header_menu > ul > li.kt-menu__item.kt-menu__item--submenu.kt-menu__item--rel.ng-star-inserted.kt-menu__item--open-dropdown > div > ul > li > a',{timeout: 60000});
    await page.click('#kt_header_menu > ul > li.kt-menu__item.kt-menu__item--submenu.kt-menu__item--rel.ng-star-inserted.kt-menu__item--open-dropdown > div > ul > li > a');
    await page.waitForTimeout(5000);

    await page.waitForSelector(constants.SEARCHBOX_SELECTOR,{timeout: 60000});
    await page.click(constants.SEARCHBOX_SELECTOR);
    await page.waitForTimeout(5000);

    await page.type(constants.SEARCHBOX_SELECTOR, applicationId);
    await page.waitForTimeout(5000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    console.log("search box enter done",applicationId);

    await page.waitForSelector('td[data-title="Application ID"] > span> a',{timeout: 120000});
    await page.click('td[data-title="Application ID"] > span> a');
    await page.waitForTimeout(5000);

    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-portlet.kt-portlet--tabs > div > div > ul > li:nth-child(6) > a',{timeout: 60000});
    await page.click('#kt_content > div > kt-application-details > div.kt-portlet.kt-portlet--tabs > div > div > ul > li:nth-child(6) > a');
    await page.waitForTimeout(5000);

    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__head > div.kt-portlet__head-toolbar > button',{timeout: 60000});
    await page.click('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__head > div.kt-portlet__head-toolbar > button');
    await page.waitForTimeout(8000);

    await page.waitForSelector('mat-bottom-sheet-container > kt-withdrawal-request-form > form > button',{timeout: 60000});
    await page.click('mat-bottom-sheet-container > kt-withdrawal-request-form > form > button');
    await page.waitForTimeout(7000);

    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(1) > input',{timeout: 60000});
    //await page.click('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(1) > input');
    await page.type('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(1) > input', netpayble);
    await page.waitForTimeout(5000);
    console.log("net payble entry done");
    
    //invoice date
    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input',{timeout: 60000});
    //await page.click('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(1) > input');
    //await page.type('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input', "2022-09-18");
    //await page.$eval('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input', el => el.value = invoiceDate);
    //await page.$eval('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input', (el, invdate) => el.value = invdate, invoiceDate);
    await page.focus('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input');
    await page.$eval('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input',(e) => e.removeAttribute("readonly"));
    await page.type('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > input', invoiceDate);
    
    //await page.keyboard.type(invoiceDate);
    await page.waitForTimeout(5000);
    console.log("date entry done");

    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > div > button',{timeout: 60000});
    await page.click('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(3) > div > div > button');
    await page.waitForTimeout(1000);

    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(4) > input',{timeout: 60000});
    //await page.click('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(1) > input');
    await page.type('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td:nth-child(4) > input', invoiceNo);
    await page.waitForTimeout(5000);

    await page.waitForSelector('#invoice_file',{timeout: 60000});
    await page.waitForTimeout(1000);

    const inputUploadHandle = await page.$('#invoice_file');
    let fileToUpload = storagefolder+'/'+fileName;
    inputUploadHandle.uploadFile(fileToUpload);
    await page.waitForTimeout(5000);
    console.log("file upload done",applicationId);

    await page.waitForSelector('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td.text-right > button',{timeout: 60000});
    await page.click('#kt_content > div > kt-application-details > div.kt-container-alt > kt-credit-line-withdrawal > div > div > div > div.kt-portlet__body > table > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td.text-right > button');
    await page.waitForTimeout(5000);

    await page.waitForSelector('#swal2-title',{timeout: 100000});
    let labelelement = await page.$('#swal2-title');
    let labelvalue = await page.evaluate(el => el.textContent, labelelement);

    await page.waitForSelector('#swal2-content',{timeout: 100000});
    let errorreasonsel = await page.$('#swal2-content');
    let errorreasonval = await page.evaluate(el => el.textContent, errorreasonsel);
    if(labelvalue == 'Success!'){
      //await browser.close();
      return {
        "fstatus":'success',
        "applicationid":applicationId,
      }
    }else if(errorreasonval.includes('already exists')){
      return {
        "fstatus":'fail',
        "applicationid":applicationId,
        "error":'duplicate'
      }
    }else{
      //await browser.close();
      return {
        "fstatus":'fail',
        "applicationid":applicationId
      }
    }
    


  }catch (error) {
    console.log("execution failed===",error.message);
      //await browser.close();
    return {
      "fstatus":'fail',
      "applicationid":applicationId
    }
  }
}
//uploadinvoice();

module.exports = uploadinvoice;