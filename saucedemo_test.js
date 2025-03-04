const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');

describe('Saucedemo Test Suite', function () {
    let driver;
    const browsers = ["chrome", "MicrosoftEdge"];

    browsers.forEach(browserName => {
        describe(`Running tests in ${browserName}`, function() {
            this.timeout(10000); // Increase the timeout

            before(async function () {
                this.timeout(10000); // Increase the timeout for before hook
                console.log(`Starting before hook for ${browserName}`);

                let builder = new Builder().forBrowser(browserName);

                if (browserName === "chrome") {
                    builder.setChromeOptions(new chrome.Options().addArguments('--headless'));
                } else if (browserName === "MicrosoftEdge") {
                    builder.setEdgeOptions(new edge.Options().addArguments('--headless'));
                }

                driver = await builder.build();

                console.log("Driver initialized");

                await driver.get("https://www.saucedemo.com");
                console.log("Website loaded");
            });

            // Hook after - close driver after all tests
            after(async function () {
                if (driver) {
                    console.log(`Quitting ${browserName} driver`);
                    await driver.quit();
                }
            });

            // Test Login for each browser
            it(`TC01-Login Success in ${browserName}`, async function () {
                this.timeout(5000); // Set timeout for this test

                console.log(`Starting TC01 in ${browserName}...`);
                await driver.findElement(By.id("user-name")).sendKeys('standard_user');
                await driver.findElement(By.xpath("//input[@id='password']")).sendKeys('secret_sauce');
                await driver.findElement(By.name("login-button")).click();

                await driver.wait(until.elementLocated(By.css('.app_logo')), 10000);
                const titleText = await driver.findElement(By.css('.app_logo')).getText();
                assert.strictEqual(titleText.includes('Swag Labs'), true);
                console.log(`Login Success in ${browserName}`);
            });

            it(`TC02-Add item to cart and validate in ${browserName}`, async function () {
                this.timeout(5000); // Set timeout for this test

                console.log(`Starting TC02 in ${browserName}...`);
                await driver.get("https://www.saucedemo.com"); // Ensure we are on the login page
                await driver.wait(until.elementLocated(By.id('user-name')), 10000);
                await driver.findElement(By.id('user-name')).sendKeys('standard_user');
                await driver.findElement(By.id('password')).sendKeys('secret_sauce');
                await driver.findElement(By.id('login-button')).click();

                await driver.wait(until.elementLocated(By.className('inventory_item_name')), 10000);
                await driver.findElement(By.id('add-to-cart-sauce-labs-backpack')).click();

                await driver.wait(until.elementLocated(By.css('.shopping_cart_badge')), 10000);
                const cartBadge = await driver.findElement(By.css('.shopping_cart_badge')).getText();
                assert.strictEqual(cartBadge, '1');
                console.log(`Item successfully added in ${browserName}`);
            });
        });
    });
});
