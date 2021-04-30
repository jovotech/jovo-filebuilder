import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join as joinPaths, resolve as resolvePaths } from 'path';
import _set from 'lodash.set';
import _merge from 'lodash.merge';

import { FileObject, FileObjectEntry, SupportedFileFormats, SupportedFileFormatsType } from './utils';
import * as Parser from './parsers';

export class FileBuilder {
  /**
   * Builds files from a .json object.
   * @param obj - The object to build files from.
   * @param path - The root path where the files should be built in.
   */
  static buildDirectory(obj: FileObject, path: string): void {
    const normalizedObject: FileObject = this.normalizeObject(obj);
    this.parseObjectToDirectory(normalizedObject, [path]);
  }

  /**
   * Reads files from a provided directory and creates a JSON object representation from it.
   * @param directory - The path to the directory.
   */
  static readDirectory(directory: string): FileObject {
    return this.parseDirectoryToObject([directory]);
  }

  /**
   * Normalizes an object of type FileObject. Checks for nested paths and nested properties and resolves them.
   * @param obj - The object to normalize.
   */
  static normalizeFileObject(obj: FileObject): FileObject {
    return this.normalizeObject(obj);
  }

  private static normalizeObject(obj: FileObject, translated: FileObject = {}): FileObject {
    for (const [key, val] of Object.entries(obj)) {
      const directories: string[] = key.split('/').filter((el) => !!el);

      // Key contains at least two directory entries.
      if (directories.length > 1 || key.endsWith('/')) {
        if (typeof val !== 'object' || Array.isArray(val)) {
          throw new Error(`Directory ${key} must contain at least one file entry.`);
        }

        // Get first directory entry.
        const directory: string = directories.shift()!;
        const fileFormat: SupportedFileFormatsType | null = this.getFileFormat(directory);

        // If the directory has a file extension, aka is a file identifier with a nested path,
        // don't append a "/" to the object path.
        const path: string = fileFormat ? directory : `${directory}/`;
        // Create a nested object, that will be recursively translated.
        let nestedObj: FileObject = val;
        // If there are still directory entries left, initiate this as a new object and
        // set the current value to the joined directory path.
        if (directories.length) {
          // Set the remaining directories as the only key with
          // the current value object as it's value.
          nestedObj = { [`${joinPaths(...directories)}/`]: val };
        }
        // Recursively parse the nested object and set the now translated object
        // as the value to the current directory.
        const translatedNestedObj: FileObject = this.normalizeObject(nestedObj, {});
        translated[path] = translatedNestedObj;
      } else {
        // Key is either of format "file.json" or nested property, such as foo.bar.
        // Try to get file format.
        const fileFormat: SupportedFileFormatsType | null = this.getFileFormat(key);

        // If no file format can be found, set the property as is.
        // _set() will handle nested properties for us.
        if (!fileFormat) {
          _set(translated, key, val);
          continue;
        }

        if (typeof val !== 'object' || Array.isArray(val)) {
          translated[key] = val;
        } else {
          // If the current value is an object, normalize that object first, before assigning it to the current key.
          const translatedNestedObj: FileObject = this.normalizeObject(val, {});
          translated[key] = translatedNestedObj;
        }
      }
    }
    return translated;
  }

  private static parseObjectToDirectory(obj: FileObject, directory: string[]) {
    for (const [key, val] of Object.entries(obj)) {
      if (key.endsWith('/')) {
        // Key is directory, recursive building.
        this.parseObjectToDirectory(val as FileObject, [...directory, key]);
        continue;
      } else {
        // Turn path into an absolute path.
        const absoluteDirectory: string = resolvePaths(...directory);
        const fileFormat: SupportedFileFormatsType = this.getFileFormat(key)!;

        if (!existsSync(absoluteDirectory)) {
          mkdirSync(absoluteDirectory, { recursive: true });
        }

        let file: FileObjectEntry = val;
        const filePath: string = joinPaths(absoluteDirectory, key);
        if (existsSync(filePath) && typeof file === 'object') {
          try {
            // Parse and merge with existing file.
            const existingFileContent: string = readFileSync(filePath, 'utf-8');

            const existingFile: FileObject = Parser.decode(existingFileContent, fileFormat);
            _merge(existingFile, val);
            file = existingFile;
          } catch (err) {
            throw new Error(`${err.message} for "${key}".`);
          }
        }

        const fileContent: string = typeof file === 'object' ? Parser.encode(file, fileFormat) : (file as string);
        writeFileSync(filePath, fileContent);
      }
    }
  }

  private static parseDirectoryToObject(directory: string[], obj: FileObject = {}): FileObject {
    const directoryPath: string = joinPaths(...directory);
    const files: string[] = readdirSync(directoryPath);

    for (const file of files) {
      const filePath: string = joinPaths(directoryPath, file);
      if (statSync(filePath).isDirectory()) {
        this.parseDirectoryToObject([...directory, file], obj);
        continue;
      } else {
        const fileFormat: SupportedFileFormatsType = this.getFileFormat(file)!;
        const fileContent: string = readFileSync(filePath, 'utf-8');
        const parsedFileContent: FileObject = Parser.decode(fileContent, fileFormat);
        // Extract root folder from path, since this was the parameter and should not be included in the resulting object.
        const [, ...key] = directory;
        // Append "/" to the end of every directory key ("folder" -> "folder/").
        const objectKey: string[] = key.map((el) => `${el}/`);
        _set(obj, [...objectKey, file], parsedFileContent);
      }
    }

    return obj;
  }

  /**
   * Returns the extension for a given file identifier.
   * @param fileName - Name of the file to filter the extension from.
   */
  private static getFileFormat(fileName: string): SupportedFileFormatsType | null {
    const formatRegex: RegExp = /\.([^.]+)$/;
    const match: string[] = formatRegex.exec(fileName) as string[];

    const fileFormat: SupportedFileFormatsType | null = match ? (match[1] as SupportedFileFormatsType) : null;

    // If file format is not supported, return null.
    return fileFormat && SupportedFileFormats.includes(fileFormat) ? fileFormat : null;
  }
}
