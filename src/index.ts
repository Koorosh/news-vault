import moment from 'moment'
import {getParserByType} from './core/parsers'
import { watchPageFactory } from './core/watch-changes'
import {from} from 'rxjs'
import {delay, filter, map, mergeMap, retryWhen, switchMap, tap} from 'rxjs/operators'
import {Page, upsertPage} from './models'
import {ParsedOutput} from './types'
import {listenToQueue, publishToQueue, Queues, WatchPageMsg} from './config/amqp'

listenToQueue<WatchPageMsg>(Queues.WATCH_PAGE)
  .pipe(
    tap(() => console.info('Start watching...')),
    mergeMap((msg: WatchPageMsg) => {
      const { url, type, taskId } = msg
      const watchUntilDate = moment().endOf('day').toDate().getTime()
      const watcher = watchPageFactory(
        getParserByType(type),
        () => new Date().getTime() < watchUntilDate
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
    retryWhen(errors =>
      errors.pipe(
        tap(console.error),
        tap(() => console.log('Restart within 5 sec.')),
        delay(5000)
      ))
  )
  .subscribe(
    pageId => console.log('pageId', pageId),
    error => console.error(`Process failed with error: ${error.message}`),
    () => console.info('Stop watching!'))