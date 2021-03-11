import { FileObject, FileObjectEntry, Parser, SupportedFileFormatsType } from '../utils';
import { JsonParser } from './JsonParser';
import { YamlParser } from './YamlParser';

const parsers: { [format in SupportedFileFormatsType]?: Parser } = {
  json: new JsonParser(),
  yaml: new YamlParser(),
};

export function decode(str: string, format: SupportedFileFormatsType): FileObject {
  const parser: Parser = parsers[format] || parsers.json!;
  return parser.decode(str);
}

export function encode(obj: FileObjectEntry, format: SupportedFileFormatsType): string {
  const parser: Parser = parsers[format] || parsers.json!;
  return parser.encode(obj);
}
