import { FileBuilder } from '../src';
import { FileObject } from '../src/utils';

describe('example', () => {
  test.skip('', () => {
    const obj = {
      '.ask/': {
        'ask-states.json': { profiles: { default: { skillId: '1234567' } } },
      },
      'skill-package/': {
        'skill.json': {
          manifest: {
            apis: {
              custom: {
                endpoint: { sslCertificateType: 'Wildcard', uri: 'hello' },
              },
            },
            publishingInformation: {
              locales: {
                'de-DE': {
                  summary: 'Sample Short Description',
                  examplePhrases: ['Alexa open hello world'],
                  keywords: ['hello', 'world'],
                  name: 'helloworld',
                  description: 'Sample Full Description',
                  smallIconUri: 'https://via.placeholder.com/108/09f/09f.png',
                  largeIconUri: 'https://via.placeholder.com/512/09f/09f.png',
                },
                'en-US': {
                  summary: 'Sample Short Description',
                  examplePhrases: ['Alexa open hello world'],
                  keywords: ['hello', 'world'],
                  name: 'helloworld',
                  description: 'Sample Full Description',
                  smallIconUri: 'https://via.placeholder.com/108/09f/09f.png',
                  largeIconUri: 'https://via.placeholder.com/512/09f/09f.png',
                },
              },
            },
            privacyAndCompliance: {
              locales: {
                'de-DE': {
                  privacyPolicyUrl: 'http://example.com/policy',
                  termsOfUseUrl: '',
                },
                'en-US': {
                  privacyPolicyUrl: 'http://example.com/policy',
                  termsOfUseUrl: '',
                },
              },
            },
          },
        },
      },
    };

    FileBuilder.buildDirectory(obj as FileObject, './build');
  });
});
