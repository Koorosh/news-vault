import {pageParserFactory} from '../../page-parser-factory'

export const parseNews = pageParserFactory([
  () => {
    const titleEl = document.querySelector<HTMLElement>('.post_news__title')
    return titleEl ? titleEl.innerText : 'NO_TITLE'
  },
  () => {
    const nodeList = document.querySelectorAll<HTMLElement>('div.post_news__text > p')
    let array: string[] = []
    nodeList.forEach(item => array.push(item.innerText)) // TODO: item.hasChildNodes exclude items which contain some other stuff
    return array.join(' ')
  },
  () => {
    const nodeList = document.querySelectorAll<HTMLElement>('span.post__tags__item')
    let array: string[] = []
    nodeList.forEach(item => array.push(item.innerText))
    return array
  }]
)