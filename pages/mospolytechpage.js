
const BasePage = require('./basepage');
const { By, Key } = require("selenium-webdriver");

const URL = "https://mospolytech.ru/"

const generateSelectXpath = (num) => `//div[@class="found-groups row not-print"]//div[contains(text(), '${num}')]`;

class MospolytechPage extends BasePage{
    async openPage(){
        await this.goToUrl(URL);
    } 
    async searchGroup(xPath,num) {
        await this.enterText(By.xpath(xPath),num);
        await this.enterText(By.xpath(xPath),Key.RETURN);
    }
    async clickElement(xpath){
        await this.click(By.xpath(xpath))
    }
    async switchWindow(){
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
    }
    async selectGroupFromResult(num) {
        await driver.sleep(1000)
        await this.click(By.xpath(generateSelectXpath(num)))
        await driver.sleep(5000)
    }
    async checkIfCurrentDayColored() {
        let days = await driver.findElements(
          By.xpath(`//div[@class="schedule-week"]/child::div`)
        );
        let thisDay;
        for (let i = 0; i < days.length; i++) {
          if (days.indexOf(days[i]) == new Date().getDay() - 1) {
            thisDay = days[i];
          }
        }
        const result = await thisDay.getAttribute("class")
        return result === "schedule-day schedule-day_today"
      }
}

module.exports = MospolytechPage