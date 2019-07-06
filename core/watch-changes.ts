import {BehaviorSubject, Observable, interval} from 'rxjs'

import {ParsedOutput, Predicate} from '../types'
import {map, switchMap} from 'rxjs/operators'

export function watchChangesFactory(
  hasChangesPredicate: Predicate,
  completeWhenPredicate: Predicate,
  timeInterval: number = 600000 ) {  // 10 min period

  const source$ = interval(timeInterval);

  return (url: string): Observable<ParsedOutput> => {
    return source$.pipe(
      switchMap((_) => {
        return
      })
    )
  }
}