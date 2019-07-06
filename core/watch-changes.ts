import {Observable, interval, from} from 'rxjs'
import {distinct, filter, switchMap} from 'rxjs/operators'

import {ParsedOutput, Parser, Predicate} from '../types'

export function watchChangesFactory<T>(
  parser: Parser,
  distinctPredicate: (values: any[]) => any,
  completeWhenPredicate: Predicate<T>,
  timeInterval: number = 600000 ) {  // 10 min period

  const source$ = interval(timeInterval);

  return (url: string): Observable<ParsedOutput[]> => {
    return source$.pipe(
      switchMap(() => from(parser(url))),
      filter(arr => arr.length > 0),
      distinct(distinctPredicate),
    )
  }
}