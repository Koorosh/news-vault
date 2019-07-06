import { head, flattenDeep } from 'lodash'
import { parseListOfNewsUrls } from './core/parsers'
import {watchChangesFactory} from './core/watch-changes'
import {ParsedOutput} from './types'

const watcher = watchChangesFactory<ParsedOutput[]>(
  parseListOfNewsUrls,
  (values: ParsedOutput[]) => head(flattenDeep(values)),
  () => new Date().getDay() > 6,
  3000
)

watcher('https://www.pravda.com.ua/archives/date_06072019/')
  .subscribe((a) => {
    console.log(a)
  })