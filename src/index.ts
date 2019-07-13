import moment from 'moment'
import {getParserByType, ParserTypes} from './core/parsers'
import {watchPageFactory} from './core/watch-changes'
import {from, of} from 'rxjs'
import {concatMap, delay, filter, map, mergeMap, retryWhen, tap, timeInterval} from 'rxjs/operators'
import {getPageById, Page, PageRecord, upsertPage} from './models'
import {ParsedOutput} from './types'
import {listenToQueue, ParsePageMsg, publishToQueue, Queues, WatchPageMsg} from './config/amqp'
import {logger} from './config/logger'

logger.info(`Start watching...`)
listenToQueue<WatchPageMsg>(Queues.WATCH_PAGE)
  .pipe(
    tap((msg: WatchPageMsg) => logger.info({ type: 'WATCHER', queue: Queues.WATCH_PAGE, msg })),
    mergeMap((msg: WatchPageMsg) => {
      const { url, type, taskId } = msg
      const watchUntilDate = moment().endOf('day').toDate().getTime()
      const watcher = watchPageFactory(
        getParserByType(type),
        () => new Date().getTime() < watchUntilDate,
        10000
      )
      return watcher(url)
        .pipe(
          map<Array<ParsedOutput>, Page>(content => ({
            url,
            content: JSON.stringify(content)
          })),
          mergeMap((page: Page) => from(upsertPage(page))),
          filter(pageId => pageId !== null),
          tap(pageId => publishToQueue(Queues.PARSED_PAGE, { taskId, pageId })),
          tap(pageId => logger.info({ type: 'WATCHER', state: 'done', taskId, pageId }))
        )
    }),
    retryWhen(errors =>
      errors.pipe(
        tap((error) => logger.error(error)),
        tap(() => logger.info('Restart within 5 sec.')),
        delay(5000)
      ))
  )
  .subscribe(
    pageId => logger.info({pageId}),
    error => logger.error({error}),
    () => logger.info('Stop watching!'))


listenToQueue<ParsePageMsg>(Queues.PARSED_PAGE)
  .pipe(
    tap((msg: ParsePageMsg) => logger.info({ type: 'WATCHER', queue: Queues.PARSED_PAGE, msg })),
    mergeMap((msg: ParsePageMsg) => {
      const { pageId, taskId } = msg
      const parser = getParserByType(ParserTypes.PRAVDA_CONTENT) // TODO: has to be configurable!

      return from(getPageById(Number(pageId)))
        .pipe(
          filter(page => !!page),
          mergeMap((page: PageRecord) => {
            const [listOfUrls]: Array<string[]> = page.content
            return from(listOfUrls)
          }),
          concatMap((url: string) => {
            return of(url)
              .pipe(delay(15000))
          }),
          mergeMap((url: string) => {
            return from(parser(url))
              .pipe(
                map((output: ParsedOutput[]) => ({
                  output,
                  url
                }))
              )
          }),
          tap(async ({output, url}) => {
            const [title, content, tags] = output;
            const pageId = await upsertPage({
              url,
              content: JSON.stringify(output)
            })
            logger.info({type: 'NEWS', pageId, title, content, tags})
          })
        )
    })
  )
  .subscribe(() => {

  })