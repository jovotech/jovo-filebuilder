import { FileObject, FileObjectEntry, Parser, SupportedFileFormatsType } from '../utils';
import { JsonParser } from './JsonParser';
import { YamlParser } from './YamlParser';

export abstract class Parsers {
  static parsers: { [format in SupportedFileFormatsType]?: Parser } = {
    json: new JsonParser(),
    yaml: new YamlParser(),
  };

  static decode(str: string, format: SupportedFileFormatsType): FileObject {
    const parser: Parser = this.parsers[format] || this.parsers.json!;
    return parser.decode(str);
  }

  static encode(obj: FileObjectEntry, format: SupportedFileFormatsType): string {
    const parser: Parser = this.parsers[format] || this.parsers.json!;
    return parser.encode(obj);
  }
}
