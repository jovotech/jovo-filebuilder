import * as yaml from 'yaml';
import { FileObject, FileObjectEntry, Parser } from '../utils';

// Configure yaml to always use double quotes on properties.
// @ts-ignore
yaml.scalarOptions.str.defaultType = 'QUOTE_DOUBLE';

export class YamlParser implements Parser {
  decode(str: string): FileObject {
    return yaml.parse(str);
  }

  encode(obj: FileObjectEntry): string {
    return yaml.stringify(obj);
  }
}
