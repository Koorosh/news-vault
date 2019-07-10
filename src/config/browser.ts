import puppeteer, { Browser } from 'puppeteer'

let browser: Browser

puppeteer.launch({
  headless: true,
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}).then(browserInstance => {
  browser = browserInstance
})

export function getBrowser(): Promise<Browser> {
  if (browser) {
    return Promise.resolve(browser)
  }
  else {
    return puppeteer.launch()
  }
}