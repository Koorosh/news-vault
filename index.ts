import { parseListOfNewsUrls } from './core/parsers'

// parseListOfNewsUrls('https://www.pravda.com.ua/news/2019/07/3/7219952/')
//   .then(page => {
//     console.log(page)
//   })

parseListOfNewsUrls('https://www.pravda.com.ua/archives/date_06072019/')
  .then(page => {
    console.log(page)
  })