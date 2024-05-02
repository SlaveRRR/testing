const { Builder, By, Key } = require("selenium-webdriver");

const scheduleXpath = '//a[span[text()="Смотрите на сайте"]]';

const btnXpath = '//*[@title="Расписание"]';

const searchGroupXpath = '//div[@class="header-search search"]/input[@class="groups"]';

const generateSelectXpath = (num) => `//div[@class="found-groups row not-print"]//div[contains(text(), '${num}')]`;

class MospolytechPage {
  constructor(driver) {
    this.driver = driver;
  }

  async clickToShedule() {
    await this.driver.findElement(By.xpath(scheduleXpath)).click();
  } 

  async clickToButton() {
    await this.driver.findElement(By.xpath(btnXpath)).click();
  }

  async searchGroup(num) {
    await this.driver.findElement(By.xpath(searchGroupXpath)).sendKeys(num);
    await this.driver.findElement(By.xpath(searchGroupXpath)).sendKeys(Key.RETURN);
  }

  async selectGroupFromResult(num) {
    await this.driver.sleep(1000)
    await this.driver.findElement(By.xpath(generateSelectXpath(num))).click();
    await this.driver.sleep(5000)
  }
}

(async function Test() {
  const driver = await new Builder().forBrowser("chrome").build();
  const mospolytechPage = new MospolytechPage(driver);

  try {
    await driver.get("https://mospolytech.ru/");
    await mospolytechPage.clickToButton();
    await mospolytechPage.clickToShedule();

    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[1]);

    await mospolytechPage.searchGroup('221-321');
    await mospolytechPage.selectGroupFromResult('221-321');

  } catch (error) {
    driver.takeScreenshot().then(function (image) {
        require("fs").writeFileSync("error.png", image, "base64");
      });
    console.log(e);
  } finally {
    await driver.quit();
  }
})();