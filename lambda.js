const assert = require("assert");
const { Builder, Browser, By } = require("selenium-webdriver");
let driver = new Builder().forBrowser(Browser.CHROME).build();
let total = 5;
let remaining = 5;
lambdatest();

async function lambdatest() {
  try {
    await driver.get("https://lambdatest.github.io/sample-todo-app/ ");
    await driver.manage().window().maximize();
    await driver.sleep(1000);

    for (let i = 1; i <= total; i++) {
      let remainingElem = await driver.findElement(
        By.xpath("//span[@class='ng-binding']")
      );
      let text = await getNewText(remainingElem)
      
      assert.equal(text, expectedText(remaining,total));
      let item = await driver.findElement(
        By.xpath(`//input[@name='li${i}']/following-sibling::span`)
      );
      let itemClass = await item.getAttribute("class");
      assert.equal(itemClass, "done-false");
      await driver.findElement(By.name("li" + i)).click();
      remaining--;
      let newText = await getNewText(remainingElem)
     
      assert.equal(newText,  expectedText(remaining,total));
      await driver.sleep(1000);
      itemClass = await item.getAttribute("class");
      assert.equal(itemClass, "done-true");
    }
    await driver.findElement(By.id("sampletodotext")).sendKeys("New Item");
    await driver.sleep(1000);
    await driver.findElement(By.id("addbutton")).click();
    total++;
    remaining++;
    let item = await driver.findElement(
      By.xpath("//input[@name='li6']/following-sibling::span")
    );
    let itemText = await getNewText(remainingElem)
    let itemClass = await item.getAttribute("class");
    let remainingElem = await driver.findElement(
      By.xpath("//span[@class='ng-binding']")
    );
    let text = await getNewText(remainingElem)
    
    assert.equal(text,  expectedText(remaining,total));
    assert.equal(itemText, "New Item");
    assert.equal(itemClass, "done-false");
    await driver.sleep(1000);
    await driver.findElement(By.name("li6")).click();
    remaining--;
    itemClass = await item.getAttribute("class");
    assert.equal(itemClass, "done-true");
    text = await getNewText(remainingElem)
   
    assert.equal(text, expectedText(remaining,total));
    await driver.sleep(3000);
  } catch (e) {
    driver.takeScreenshot().then(function (image) {
      require("fs").writeFileSync("screen_error", image, "base64");
    });
    console.log(e);
  } finally {
    await driver.quit();
  }
}