const {Given, When, Then, Before, After} = require('cucumber');
const puppeteer = require('puppeteer');
const chai = require("chai");
const expect = chai.expect;
const { clickElement, getText } = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
  await this.page.goto("http://qamid.tmweb.ru/client/index.php");
  await this.page.waitForSelector("a.page-nav__day:nth-child(2)");
  await clickElement(this.page, "a.page-nav__day:nth-child(2)"); //переключаемся на следующий день
  await clickElement(this.page, ".movie-seances__time"); //выбираем первый сеанс
  await page.waitForNavigation();
});
  
After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", async function (string) {
  expect(this.page.url()).to.equal(`https://qamid.tmweb.ru/client${string}`);
});

When("user books one seat", { timeout: 10000 }, async function () {
    await clickElement(this.page, ".buying-scheme__chair_standart"); //выбираем первое свободное стандартное место
    await clickElement(this.page, ".acceptin-button");
    await this.page.waitForNavigation();
});

When("user books two seats", { timeout: 10000 }, async function () {
  await clickElement(this.page, ".buying-scheme__chair_standart"); //выбираем первое свободное стандартное место
  await clickElement(this.page, ".buying-scheme__chair_standart:nth-child(2)"); //выбираем второе свободное место
  await clickElement(this.page, ".acceptin-button"); //нажимаем на кнопку Забронировать
  await this.page.waitForNavigation();
});

When("user chooses booked seat", { timeout: 10000 }, async function () {
  await clickElement(this.page, ".buying-scheme__chair_disabled");
});

Then("user sees {string} page", async function (string) {
  expect(this.page.url()).to.equal(`https://qamid.tmweb.ru/client${string}`);
});

Then("user sees one seat booked", async function () {
    const actual = await getText(this.page, ".ticket__chairs"); //достаем текст из строки ряд/место
    const pattern = /^\d*\/\d*$/; //паттерн проверяющий, что куплен только один билет
    expect(actual).to.match(pattern);
});

Then("user sees two seats booked", async function () {
  const actual = await getText(this.page, ".ticket__chairs"); //достаем текст из строки ряд/место
  const pattern = /^\d*\/\d*, \d*\/\d*$/; //паттерн проверяющий, что куплен только один билет
  expect(actual).to.match(pattern);
});

Then("accepting button is disabled", async function () {
  const actual = await this.page.$('button[disabled]') !== null; //кнопка забронировать должна быть disabled
  expect(actual).to.be.true;
});