const YandexMarketPage = require("../pages/marketpage");
const mocha = require("mocha");

const SLEEP_TIME12 = 120000;
const SLEEP_TIME5 = 50000;
const SLEEP_TIME7 = 70000;

const withErrorHandling = (fn, handler) => {
   return async () => {
      try {
         await fn();
      } catch (error) {
         console.error.png(error);
         handler();
      }
   };
};

mocha.describe("YandexMarket test", function () {
   this.timeout(10000000);
   const yandexMarketPage = new YandexMarketPage();
   let firstElem;

   before(async () => {
      await yandexMarketPage.openPage();
   });

   after(async () => {
      await yandexMarketPage.closeBrowser();
   });

   afterEach(async function () {
      if (this.currentTest.state === "failed") {
         const dateTime = new Date().toLocaleDateString();
         await yandexMarketPage.saveScreenshot(dateTime);
      }
   });

   it(
      "open xbox page",
      withErrorHandling(
         async () => {
            await yandexMarketPage.clickCatalogButton();
            await yandexMarketPage.hoverCategory();
            await yandexMarketPage.clickXbox();
            await yandexMarketPage.driver.sleep(SLEEP_TIME12);
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "log titles and prices xbox page",
      withErrorHandling(
         async () => {
            firstElem = await yandexMarketPage.logElements();
            await yandexMarketPage.driver.sleep(SLEEP_TIME7);
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "add to favorites",
      withErrorHandling(
         async () => {
            await yandexMarketPage.addFavorites();
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "open favorites",
      withErrorHandling(
         async () => {
            await yandexMarketPage.openFavorites();
            await yandexMarketPage.driver.sleep(SLEEP_TIME5);
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "remove favorites",
      withErrorHandling(
         async () => {
            if (await yandexMarketPage.isElementPresent(By.xpath(yandexMarketPage.xpathRemoveFavorites))) {
               await yandexMarketPage.clickElement(By.xpath(yandexMarketPage.xpathRemoveFavorites));
            } else {
               console.log("Элемент 'Удалить из избранного' не найден");
            }
            await yandexMarketPage.driver.sleep(SLEEP_TIME7);
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "check favorite",
      withErrorHandling(
         async () => {
            if (
               (await yandexMarketPage.isElementPresent(By.xpath(yandexMarketPage.xpathTitles))) &&
               (await yandexMarketPage.isElementPresent(By.xpath(yandexMarketPage.xpathPrices)))
            ) {
               const [title, price] = await yandexMarketPage.getFavorites();
               if (title[0] !== firstElem[0][0] || price[0] !== firstElem[0][1]) {
                  throw new Error(
                     `Expected title: ${firstElem[0][0]}, price: ${firstElem[0][1]}. Actual title: ${title[0]}, price: ${price[0]}`,
                  );
               }
            } else {
               console.log("Элементы на странице 'Избранное' не найдены");
            }
            await yandexMarketPage.driver.sleep(SLEEP_TIME7);
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );

   it(
      "refresh page",
      withErrorHandling(
         async () => {
            await yandexMarketPage.refreshPage();
            const savedText = await yandexMarketPage.getTextFromElement(By.xpath(yandexMarketPage.xpathSave));
            if (savedText !== "Сохранено") {
               throw new Error(`Expected "Сохранено", got "${savedText}"`);
            }
            await yandexMarketPage.driver.sleep(SLEEP_TIME7);
         },
         async () => await yandexMarketPage.saveScreenshot("error.png"),
      ),
   );
});
