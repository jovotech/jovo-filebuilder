import { FileBuilder } from '../src';
import { FileObject } from '../src/utils';

describe('FileBuilder.normalizeFileObject()', () => {
  test('simple directory', () => {
    const obj: FileObject = {
      'directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(obj);

    expect(normalized).toStrictEqual({
      'directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    });
  });

  test('nested directories', () => {
    const obj: FileObject = {
      'directory/nested/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(obj);

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
    const obj: FileObject = {
      '.directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(obj);

    expect(normalized).toStrictEqual({
      '.directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    });
  });

  test('nested directory with file', () => {
    const obj: FileObject = {
      'directory/nested/file.json': {
        hello: 'world',
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(obj);

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
    const obj: FileObject = {
      'directory/file.json': {
        'hello.nested': 'world',
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(obj);

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
    const obj: FileObject = {
      'directory/.directory/': {
        'file.json': {
          hello: 'world',
        },
      },
    };

    const normalized: FileObject = FileBuilder.normalizeFileObject(obj);

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
});
