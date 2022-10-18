const puppeteer = require('puppeteer');
const constants = require('./constants');
const dotenv = require("dotenv");
const fs = require('fs');
const storagefolder = __dirname + '/uploads';
const {formatDate} = require('./helper');
dotenv.config();
async function uploadinvoice(contentlist,{userid, password}) {
  let consolidatedResponse = [];
  try{
    
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
    //await page.goto(process.env.BASE_URL);
    await page.goto(process.env.BASE_URL, {timeout: 60000, waitUntil: 'domcontentloaded'})
    await page.waitForTimeout(5000);
    await page.waitForSelector(constants.USERNAME_SELECTOR, {timeout: 60000});
    await page.click(constants.USERNAME_SELECTOR);
    await page.keyboard.type(userid);
    await page.waitForTimeout(5000);
    await page.waitForSelector(constants.PASSWORD_SELECTOR, {timeout: 60000});
    await page.click(constants.PASSWORD_SELECTOR);
    await page.keyboard.type(password);
    await page.waitForTimeout(5000);
    await page.waitForSelector(constants.SUBMIT_BUTTON_SELECTOR);
    await page.click(constants.SUBMIT_BUTTON_SELECTOR);
    await page.waitForTimeout(5000); // wait for 5 seconds
    console.log("login completed");
    //console.log("contentlist=",contentlist);
    //contentlist.forEach(async function (contentdetail) {})
    for (const listitem of contentlist) {
      let {applicationId, invoiceNo, invoiceDate, netpayble} = listitem.contents;
      let fileName = listitem.file;
      let fileToUpload = storagefolder+'/'+fileName;

      await page.waitForSelector('#kt_header_menu > ul > li:nth-child(1) > a',{timeout: 60000});
      await page.click('#kt_header_menu > ul > li:nth-child(1) > a');
      await page.waitForTimeout(5000); // wait for 5 seconds
      console.log("header menu selection completed",applicationId, "file=", fileName);

      await page.waitForTimeout(5000); // wait for 5 seconds
      await page.waitForSelector('#kt_header_menu > ul > li:nth-child(3) > a',{timeout: 60000});
      await page.click('#kt_header_menu > ul > li:nth-child(3) > a');
      await page.waitForTimeout(5000); // wait for 5 seconds
      console.log("header menu selection completed next",applicationId, "file=", fileName);

      await page.waitForSelector('#kt_header_menu > ul > li.kt-menu__item.kt-menu__item--submenu.kt-menu__item--rel.ng-star-inserted.kt-menu__item--open-dropdown > div > ul > li > a',{timeout: 60000});
      await page.click('#kt_header_menu > ul > li.kt-menu__item.kt-menu__item--submenu.kt-menu__item--rel.ng-star-inserted.kt-menu__item--open-dropdown > div > ul > li > a');
      await page.waitForTimeout(5000);

      await page.waitForSelector(constants.SEARCHBOX_SELECTOR,{timeout: 60000});
      const searchinput = await page.$(constants.SEARCHBOX_SELECTOR);
      await searchinput.click({ clickCount: 3 });
      //await page.click(constants.SEARCHBOX_SELECTOR);
      await page.waitForTimeout(5000);

      await page.type(constants.SEARCHBOX_SELECTOR, applicationId);
      await page.waitForTimeout(5000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(5000);
      console.log("search box enter done",applicationId, "file=", fileName);
      try {
        await page.waitForSelector('#kt_content > div > kt-application-list > div > div.kt-portlet__body.flex-centered.ng-star-inserted > kt-empty > div > h3',{timeout: 100000});
        //producttype = document.querySelector('#idProductType').innerText;
        fs.unlinkSync(fileToUpload);
        consolidatedResponse.push({
        "fstatus":"fail",
        "applicationid":applicationId,
        "errormsg":'No Applications Found',
        "invoice":fileName,
        });
        console.log(consolidatedResponse);
        continue;
      } catch (error) {
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
          fs.unlinkSync(fileToUpload);
          //await browser.close();
          consolidatedResponse.push({
          "fstatus":"success",
          "applicationid":applicationId,
          "errormsg":'',
          "invoice":fileName,
          });
          console.log(consolidatedResponse);
        }else if(errorreasonval.includes('already exists')){
          fs.unlinkSync(fileToUpload);
          consolidatedResponse.push({
            "fstatus":"fail",
            "applicationid":applicationId,
            "errormsg":'already exists',
            "invoice":fileName,
            });
            console.log(consolidatedResponse);
        }else{
          consolidatedResponse.push({
            "fstatus":"fail",
            "applicationid":applicationId,
            "errormsg":'unknown issue',
            "invoice":fileName,
            });
            console.log(consolidatedResponse);
        }
        continue;
      } 

    }
    console.log("consolidated response====",consolidatedResponse);
    return {
      'allprocess':true,
      'data':consolidatedResponse
    };
    await browser.close();
   
  }catch(error){
    throw error;
  }
}
//uploadinvoice();

module.exports = uploadinvoice;