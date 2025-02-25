const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');

describe('Saucedemo Test Suite', function () {
    let driver;
    const browsers = ["chrome", "firefox", "MicrosoftEdge"];

    browsers.forEach(browserName => {
        describe(`Running tests in ${browserName}`, function() {
            beforeEach(async function () {
                this.timeout(120000); // Increase the timeout to 60 seconds
                console.log("Starting beforeEach");

                driver = await new Builder()
                    .forBrowser(browserName)
                    .setChromeOptions(browserName === "chrome" ? new chrome.Options().addArguments('--headless') : undefined)
                    .setFirefoxOptions(browserName === "firefox" ? new firefox.Options().addArguments('--headless') : undefined)
                    .setEdgeOptions(browserName === "MicrosoftEdge" ? new edge.Options().addArguments('--headless') : undefined)
                    .build();
                
                console.log("Driver initialized");

                await driver.get("https://www.saucedemo.com");
                console.log("Website loaded");
            });

            // Hook afterEach - close driver after each test
            afterEach(async function () {
                if (driver) {
                    await driver.quit();
                }
            });

            // Test Login for each browser
            it(`TC01-Login Success in ${browserName}`, async function () {
                await driver.findElement(By.id('user-name')).sendKeys('standard_user');
                await driver.findElement(By.id('password')).sendKeys('secret_sauce');
                await driver.findElement(By.id('login-button')).click();

                const titleText = await driver.findElement(By.css('.app_logo')).getText();
                assert.strictEqual(titleText.includes('Swag Labs'), true);
                console.log(`Login Success in ${browserName}`);
            });

            it(`TC04-Add item to cart and validate in ${browserName}`, async function () {
                await driver.findElement(By.id('user-name')).sendKeys('standard_user');
                await driver.findElement(By.id('password')).sendKeys('secret_sauce');
                await driver.findElement(By.id('login-button')).click();

                await driver.wait(until.elementLocated(By.className('inventory_item_name')), 5000);
                await driver.findElement(By.id('add-to-cart-sauce-labs-backpack')).click();

                const cartBadge = await driver.findElement(By.css('.shopping_cart_badge')).getText();
                assert.strictEqual(cartBadge, '1');
                console.log('Item successfully added');
            });
        });
    });
});
