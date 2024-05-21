const LambdaPage = require("../pages/lambdapage");
const Mocha = require('mocha'); 
const { describe, before, after,it } = Mocha;
const {assert} = require('chai')

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

describe("Lambda test", function () {
  const lamdaPage = new LambdaPage(5,5);

  before(async () => {
    await lamdaPage.openPage();
  });

  after(async () => {
    await lamdaPage.closeBrowser();
  });
  
  it("Checking remaining text",withErrorHandling(async () => {
    assert.isTrue(
      await lamdaPage.checkRemainingElem(),
      "Remaining text does not match expected"
    );
  },async () => await lamdaPage.saveScreenshot('error')));


  it("Checking first element is not done", withErrorHandling(async () => {
    const firstItem = await lamdaPage.getItem(1);
    assert.isTrue(
      await lamdaPage.isItemNotActive(firstItem),
      "First item should not be active"
    );
  },async () => await lamdaPage.saveScreenshot('error')));

  
  it("Clicking the first element and checking if it becomes active and remaining text changes",withErrorHandling(async () => {
    const firstItem = await lamdaPage.getItem(1);
    await lamdaPage.clickItem(1);
    assert.isTrue(
      await lamdaPage.isItemActive(firstItem),
      "First item did not become active after click"
    );
    assert.isTrue(
      await lamdaPage.checkRemainingElem(),
      "Remaining text did not update correctly"
    );
  },async () => await lamdaPage.saveScreenshot('error')));

  

  it("Checking if other list items are not active and clicks them and checks if they become active and remaining text changes",withErrorHandling(async () => {
    for (let i = 2; i <= lamdaPage.total; i++) {
        const item = await lamdaPage.getItem(i);
        assert.isFalse(
          await lamdaPage.isItemActive(item),
          `Item ${i} should initially be inactive`
        );
        await lamdaPage.clickItem(i);
        assert.isTrue(
          await lamdaPage.isItemActive(item),
          `Item ${i} did not become active after click`
        );
        assert.isTrue(
          await lamdaPage.checkRemainingElem(),
          "Remaining text did not update correctly"
        );
      }
  },async () => await lamdaPage.saveScreenshot('error')));

  

  it("Adding new item",withErrorHandling(async () => {
    await lamdaPage.addItem("New item");
    const newItem = await lamdaPage.getItem(lamdaPage.total);
    assert.isFalse(
      await lamdaPage.isItemActive(newItem),
      "Newly added item should initially be inactive"
    );
    assert.isTrue(
      await lamdaPage.checkRemainingElem(),
      "Remaining text did not update correctly after adding an item"
    );
  },async () => await lamdaPage.saveScreenshot('error')));


  it("Clicking new element",withErrorHandling(async () => {
    await lamdaPage.clickItem(lamdaPage.total);
    assert.isTrue(
      await lamdaPage.checkRemainingElem(),
      "Remaining text did not update correctly after clicking new item"
    );
  },async () => await lamdaPage.saveScreenshot('error')));
});