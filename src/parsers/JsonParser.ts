import { FileObject, FileObjectEntry, Parser } from '../utils/Interfaces';

export class JsonParser implements Parser {
  decode(str: string): FileObject {
    return JSON.parse(str);
  }

  encode(obj: FileObjectEntry): string {
    return JSON.stringify(obj, null, 2);
  }
}
