const puppeteer = require("puppeteer");
const { clickElement, getText, getAttributeValue } = require("./lib/commands.js");

let page;

beforeEach(async () => {
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
    page.close();
});

describe("Tickets booking tests", () => {
    beforeEach(async () => {
        await page.goto("http://qamid.tmweb.ru/client/index.php");
        await page.waitForSelector("a.page-nav__day:nth-child(2)");
        await clickElement(page, "a.page-nav__day:nth-child(2)"); //переключаемся на следующий день
        await clickElement(page, ".movie-seances__time"); //выбираем первый сеанс
        await page.waitForNavigation();
        expect(page.url()).toEqual("https://qamid.tmweb.ru/client/hall.php");
    });

    test("One ticket booked successfully", async () => {
        await clickElement(page, ".buying-scheme__chair_standart"); //выбираем первое свободное стандартное место
        await clickElement(page, ".acceptin-button"); //нажимаем на кнопку Забронировать
        await page.waitForNavigation();
        expect(page.url()).toEqual("https://qamid.tmweb.ru/client/payment.php");
        const actual = await getText(page, ".ticket__chairs"); //достаем текст из строки ряд/место
        const pattern = /^\d*\/\d*$/; //паттерн проверяющий, что куплен только один билет
        expect(actual).toMatch(pattern);
    });

    test("Two tickets booked successfully", async() => {
        await clickElement(page, ".buying-scheme__chair_standart"); //выбираем первое свободное стандартное место
        await clickElement(page, ".buying-scheme__chair_standart:nth-child(2)"); //выбираем второе свободное место
        await clickElement(page, ".acceptin-button"); //нажимаем на кнопку Забронировать
        await page.waitForNavigation();
        expect(page.url()).toEqual("https://qamid.tmweb.ru/client/payment.php");
        const actual = await getText(page, ".ticket__chairs");
        const pattern = /^\d*\/\d*, \d*\/\d*$/; //паттерн проверяющий, что куплено два билета
        expect(actual).toMatch(pattern);
    });

    test("Choosing booked place should be unseccessful", async() => {
        await clickElement(page, ".buying-scheme__chair_disabled"); //пытаемся выбрать забронированное место
        const actual = await page.$('button[disabled]') !== null; //кнопка забронировать должна быть disabled
        expect(actual).toBe(true);
    })
});