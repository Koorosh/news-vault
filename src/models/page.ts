import { isEqual } from 'lodash'
import db, {Tables} from '../config/db'

export type Page = {
  url: string,
  content: any,
}

export type PageRecord = {
  id: number,
  url: string,
  content: any,
  created_at: string,
  updated_at: string
}

export async function savePage(page: Page): Promise<number> {
  return db<PageRecord>(Tables.PAGES)
    .insert(page)
    .returning(['id'])
    .then(([{id}]) => id)
}

export async function upsertPage(page: Page): Promise<number | null> {
  const { id, content } = await db<PageRecord>(Tables.PAGES)
    .where({ url: page.url})
    .first()
    .returning(['id', 'content'])

  if (isEqual(page.content, content)) return null

  if ( id ) {
    return db<PageRecord>(Tables.PAGES)
      .update(page)
      .where({ id })
      .returning(['id'])
      .then(([{id}]) => id)
  }

  return savePage(page)
}