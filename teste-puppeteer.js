const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  console.log('Puppeteer conseguiu lançar o navegador!');
  await browser.close();
})();