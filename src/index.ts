import moment from 'moment'
import {getParserByType} from './core/parsers'
import { watchPageFactory } from './core/watch-changes'
import {from} from 'rxjs'
import {filter, map, switchMap, tap} from 'rxjs/operators'
import {Page, upsertPage} from './models'
import {ParsedOutput} from './types'
import {listenToQueue, publishToQueue, Queues, WatchPageMsg} from './config/amqp'

listenToQueue<WatchPageMsg>(Queues.WATCH_PAGE)
  .pipe(
    switchMap((msg: WatchPageMsg) => {
      const { url, type, taskId } = msg
      const watchUntilDate = moment().endOf('day').toDate().getTime()
      const watcher = watchPageFactory(
        getParserByType(type),
        () => new Date().getTime() < watchUntilDate,
        2000
      )
      return watcher(url)
        .pipe(
          map<Array<ParsedOutput>, Page>(content => ({
            url,
            content: JSON.stringify(content)
          })),
          switchMap((page: Page) => from(upsertPage(page))),
          filter(pageId => pageId !== null),
          tap(pageId => publishToQueue(Queues.PARSED_PAGE, { taskId, pageId }))
        )
    }),
  )
  .subscribe((pageId) => {
    console.log('pageId', pageId)
  })