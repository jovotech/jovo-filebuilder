export type FileObjectEntry = string | string[] | boolean | FileObject;

export interface FileObject {
  [key: string]: FileObjectEntry;
}

export const SupportedFileFormats = <const>['json', 'yaml', 'txt', 'xml', 'js', 'ts'];
export type SupportedFileFormatsType = typeof SupportedFileFormats[number];

export interface Parser {
  decode(str: string): FileObject;
  encode(obj: FileObjectEntry): string;
}
