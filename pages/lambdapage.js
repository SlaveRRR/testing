const BasePage = require("./basepage");
const { By, until } = require("selenium-webdriver");

const URL = "https://lambdatest.github.io/sample-todo-app/";

class LambdaPage extends BasePage {
   constructor(remaining, total) {
      super();
      this.remaining = remaining;
      this.total = total;
   }

   async openPage() {
      await this.goToUrl(URL);
   }
   async expectedText(remaining, total) {
      return `${remaining} of ${total} remaining`;
   }

   async checkRemainingElem() {
      return (
         (await this.getText(By.xpath('//span[@class="ng-binding"]'))) ===
         (await this.expectedText(this.remaining, this.total))
      );
   }

   async getItem(i) {
      return await this.driver.findElement(By.xpath(`//input[@name='li${i}']/following-sibling::span`));
   }

   async isItemNotActive(item) {
      return (await item.getAttribute("class")) === "done-false";
   }

   async clickItem(item) {
      let input = await this.driver.findElement(By.name("li" + item));
      await input.click();
      this.remaining--;
   }

   async isItemActive(item) {
      return (await item.getAttribute("class")) === "done-true";
   }

   async addItem(text) {
      await this.enterText(By.id("sampletodotext"), text);
      await this.click(By.id("addbutton"));
      this.remaining++;
      this.total++;
   }
}

module.exports = LambdaPage;
