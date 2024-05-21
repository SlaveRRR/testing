const { Builder, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
class BasePage {
   constructor() {
      // const options = new chrome.Options();
      // options.addArguments(
      //    "--user-data-dir=C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\User Data",
      //    "--profile-directory=Default",
      //    "--ignore-certificate-errors",
      //    "--ignore-ssl-errors",
      // );
      // .setChromeOptions(options)
      this.driver = new Builder().forBrowser(Browser.CHROME).build();
      this.driver.manage().setTimeouts({ implicit: 5000 });
   }

   async goToUrl(url) {
      await this.driver.get(url);
   }

   async enterText(locator, text) {
      await this.driver.findElement(locator).sendKeys(text);
   }

   async getText(locator) {
      return await this.driver.findElement(locator).getText();
   }

   async click(locator) {
      await this.driver.findElement(locator).click();
   }

   async isElementPresent(locator) {
      try {
         await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
         return true;
      } catch (error) {
         return false;
      }
   }

   async clickElement(locator) {
      await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
      await this.driver.findElement(locator).click();
   }

   async getTextFromElement(locator) {
      await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
      return await this.driver.findElement(locator).getText();
   }

   async getTextFromMultipleElements(locator) {
      const elements = await this.driver.findElements(locator);
      const texts = [];
      for (const element of elements) {
         texts.push(await element.getText());
      }
      return texts;
   }

   async saveScreenshot(fileName) {
      await this.driver.takeScreenshot().then((img) => {
         fs.writeFileSync(fileName, img, "base64");
      });
   }

   async closeBrowser(delay = 0) {
      if (delay) await this.driver.sleep(delay);
      await this.driver.quit();
   }
}

module.exports = BasePage;
