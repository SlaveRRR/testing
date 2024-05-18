const MospolytechPage = require("../pages/mospolytechpage");
const Mocha = require('mocha'); 
const { describe, before, after,it } = Mocha;

const scheduleXpath = '//a[span[text()="Смотрите на сайте"]]';

const btnXpath = '//*[@title="Расписание"]';

const searchGroupXpath = '//div[@class="header-search search"]/input[@class="groups"]';

const groupNum = '221-321';

const withErrorHandling = (fn,handler) => {
  return async () => {
    try {
      await fn();
    } catch (error) {
      console.error(error);
      handler();
    }
  };
};


describe("Mospolytech test", async () => {
  const mospolytechPage = new MospolytechPage();

  before(async () => {
    await mospolytechPage.openPage();
  });
  
  after(async () => {
    await mospolytechPage.closeBrowser();
  });

  it("open schedule page", withErrorHandling(async () => {
    await mospolytechPage.clickElement(btnXpath);
    await mospolytechPage.clickElement(scheduleXpath);
    await mospolytechPage.switchWindow();
  },async () => await mospolytechPage.saveScreenshot('error')));

  
  it("search group", withErrorHandling(async () => {
    await mospolytechPage.searchGroup(searchGroupXpath,groupNum);
  },async () => await mospolytechPage.saveScreenshot('error')));

  it("select result", withErrorHandling(async () => {
    await mospolytechPage.selectGroupFromResult(groupNum);
  },async () => await mospolytechPage.saveScreenshot('error')));

});