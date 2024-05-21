// !!!!!!!!!! удалить allure
// npm uninstall -g allure-commandline
// "test": "mocha tests/*.js --recursive --timeout 60000",
const { Browser, By, Key, until, Builder } = require("selenium-webdriver");

(async function example() {
   let driver = await new Builder().forBrowser(Browser.CHROME).build();
   try {
      await driver.get("https://www.google.com/ncr");
      await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
      await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
   } finally {
      driver.quit();
   }
})();
