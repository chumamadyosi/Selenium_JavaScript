const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const { By, Key, until, WebDriver} = require('selenium-webdriver');
const { Executor, HttpClient } = require('selenium-webdriver/http');

(async function example() {
    let driver = await  new webdriver.Builder()
    .forBrowser(webdriver.Browser.CHROME)
    .usingServer('http://localhost:4444/wd/hub')
    .build();
    console.log("driver2 log");
    console.log(driver);
    let sessionId= (await driver.getSession()).getId();
    let httpClient = new HttpClient('http://localhost:4444/wd/hub');
    let executor = new Executor(httpClient);
     let driver2 = await new WebDriver(driver.getSession(),executor);
     console.log("driver2 log");
     console.log(driver2);
     console.log("testing var "+sessionId);

     

  try {
    await driver.get('https://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();