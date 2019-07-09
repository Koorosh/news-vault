import puppeteer, { Browser } from 'puppeteer'

let browser: Browser

puppeteer.launch().then(browserInstance => {
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