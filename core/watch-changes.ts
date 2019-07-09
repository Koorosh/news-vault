import {Observable, interval, from} from 'rxjs'
import {filter, switchMap, takeWhile} from 'rxjs/operators'

import {ParsedOutput, Parser, Predicate} from '../types'

export function watchPageFactory(
  parser: Parser,
  completeWhen: Predicate<ParsedOutput[]>,
  timeInterval: number = 600000) {

  const source$ = interval(timeInterval)

  return (url: string): Observable<ParsedOutput[]> =>
    source$.pipe(
      switchMap(() => from(parser(url))),
      filter(arr => arr.length > 0),
      takeWhile((arr) => completeWhen(arr))
    )
}