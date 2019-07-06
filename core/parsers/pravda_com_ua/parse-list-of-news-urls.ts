import {Parser} from '../../../types'
import {pageParserFactory} from '../../page-parser-factory'

const HOST_URL = 'https://www.pravda.com.ua'

// Returns list of URLs with news published on a page.
export const parseListOfNewsUrls: Parser = pageParserFactory([
  (hostUrl) => {
    const nodeList = document.querySelectorAll<HTMLAnchorElement>('.news.news_all > div.article > div.article__title > a')
    let array: string[] = []
    nodeList.forEach(item => array.push(item.getAttribute('href') || ''))
    return array
      .filter(a => a.length > 0)
      .map(path => path.startsWith('/') ? `${hostUrl}${path}` : path)
  }], HOST_URL
)