const express = require('express');
const app = express();
const port = 3003;

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const { By, Key, until, WebDriver} = require('selenium-webdriver');
const { Executor, HttpClient } = require('selenium-webdriver/http');

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.get('/', (req, res) => {
   res.send('Hello this is the landig page!');
});

app.get('/openGoogle', async(req, res) => {
  const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-site-isolation-trials');
    chromeOptions.addArguments('disable-infobars');
    chromeOptions.addArguments('--disable-extensions');
    chromeOptions.addArguments('--disable-gpu');
    let driver = await  new webdriver.Builder()
    .forBrowser(webdriver.Browser.CHROME)
    .usingServer('http://localhost:4444/wd/hub')
    .setChromeOptions(chromeOptions)
    .build();
    
    let sessionId = (await driver.getSession()).getId();
    console.log(sessionId);

      try {
        await driver.get('https://www.google.com/ncr');
        res.send(sessionId);
      } finally {
      }
});

app.get('/searchGoogle/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

      let httpClient = new HttpClient('http://localhost:4444/wd/hub');
      let executor = new Executor(httpClient);
      let driver2 = await new WebDriver(sessionId,executor);
    try {
      await driver2.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
      await delay(3000);

      res.send(`Session Data for ID ${sessionId}`);
    }catch(err){
        console.log(err);
        driver2.quit();
    } finally {
      await driver2.quit();
    }
});

async function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});