import {parseListOfNewsUrls, parseNews} from './pravda_com_ua'

export * from './pravda_com_ua'

export enum ParserTypes {
  PRAVDA_CONTENT = 'pravda_content',
  PRAVDA_LIST = 'pravda_list',
}

export function getParserByType(type: ParserTypes) {
  switch (type) {
    case ParserTypes.PRAVDA_CONTENT:
      return parseNews
    case ParserTypes.PRAVDA_LIST:
      return parseListOfNewsUrls
    default:
      throw new Error(`Unsupported ParserType: ${type}`);
  }
}