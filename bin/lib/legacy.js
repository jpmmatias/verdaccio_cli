"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPackagesFromVerdaccio = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fetchPackagesFromVerdaccio = async () => {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    const registryUrl = 'http://localhost:4873';
    await page.goto(registryUrl);
    await page.setViewport({ width: 1080, height: 900024 });
    await page.waitForSelector('div.container.content');
    const packages = await page.evaluate(() => {
        const packageNodes = document.querySelectorAll('.package-title');
        const packageList = [];
        packageNodes.forEach(node => {
            packageList.push({ option: node.innerHTML, value: node.innerHTML });
        });
        return packageList;
    });
    await browser.close();
    return packages;
};
exports.fetchPackagesFromVerdaccio = fetchPackagesFromVerdaccio;
//# sourceMappingURL=legacy.js.map