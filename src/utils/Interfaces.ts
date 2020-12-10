export type FileObjectEntry = string | string[] | boolean | FileObject;

export interface FileObject {
  [key: string]: FileObjectEntry;
}

export const SupportedFileFormats = ['json', 'yaml', 'txt', 'xml', 'js', 'ts'] as const;
export type SupportedFileFormatsType = typeof SupportedFileFormats[number];

export interface Parser {
  decode(str: string): FileObject;
  encode(obj: FileObjectEntry): string;
}
