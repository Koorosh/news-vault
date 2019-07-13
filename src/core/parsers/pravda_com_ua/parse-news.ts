import {pageParserFactory} from '../../page-parser-factory'

export const parseNews = pageParserFactory([
  () => {
    const titleEl = document.querySelector<HTMLElement>('.post_news__title')
    return titleEl ? titleEl.innerText : 'NO_TITLE'
  },
  () => {
    const stopWords = ['Читайте також:', 'Нагадаємо:']
    const nodeList = document.querySelectorAll<HTMLElement>('div.post_news__text > p')
    let array: string[] = []
    nodeList.forEach(item => array.push(item.innerText))
    const rawText = array.join(' ')
    const stopIndexes = stopWords
      .map(stopWord => rawText.lastIndexOf(stopWord))
      .filter(stopWordIdx => stopWordIdx > 0)

    if (stopIndexes.length === 0) return rawText
    const mostRecentStopWordIndex = Math.min(...stopIndexes)
    return rawText.substring(0, mostRecentStopWordIndex)
  },
  () => {
    const nodeList = document.querySelectorAll<HTMLElement>('span.post__tags__item')
    let array: string[] = []
    nodeList.forEach(item => array.push(item.innerText))
    return array
  }]
)