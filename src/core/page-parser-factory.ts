import {SerializableOrJSHandle} from 'puppeteer'

import { NodeParser, ParsedOutput } from '../types'
import {getBrowser} from '../config/browser'

export function pageParserFactory(parsers: NodeParser[], ...args: SerializableOrJSHandle[]) {
  return async (url: string): Promise<Array<ParsedOutput>> => {
    const browser = await getBrowser()
    const page = await browser.newPage()
    await page.goto(url)
    const results = await Promise.all(parsers.map((parserFn) => page.evaluate(parserFn, ...args)))
    await page.close()
    return results
  }
}
