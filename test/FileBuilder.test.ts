import { FileBuilder } from '../src';
import { FileObject } from '../src/utils';

describe('FileBuilder.normalizeFileObject()', () => {
  test('should not alter any properties if not nested', () => {
    const fileObject: FileObject = {
      'directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      'directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    });
  });

  test('nested directories', () => {
    const fileObject: FileObject = {
      'directory/nested/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      'directory/': {
        'nested/': {
          'file.json': {
            hello: 'world',
          },
        },
      },
    });
  });

  test('directory with dot in name', () => {
    const fileObject: FileObject = {
      '.directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      '.directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    });
  });

  test('nested directory with file', () => {
    const fileObject: FileObject = {
      'directory/nested/file.json': {
        hello: 'world',
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      'directory/': {
        'nested/': {
          'file.json': {
            hello: 'world',
          },
        },
      },
    });
  });

  test('nested directory with nested properties', () => {
    const fileObject: FileObject = {
      'directory/file.json': {
        'hello.nested': 'world',
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      'directory/': {
        'file.json': {
          hello: {
            nested: 'world',
          },
        },
      },
    });
  });

  test('nested directory with dot', () => {
    const fileObject: FileObject = {
      'directory/.directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      'directory/': {
        '.directory/': {
          'file.json': {
            hello: 'world',
          },
        },
      },
    });
  });

  test('two nested with same directory', () => {
    const fileObject: FileObject = {
      'directory/file1.json': {
        hello: 'world',
      },
      'directory/file2.json': {
        hello: 'world',
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(fileObject);

    expect(normalized).toStrictEqual({
      'directory/': {
        'file1.json': { hello: 'world' },
        'file2.json': { hello: 'world' },
      },
    });
  });
});
