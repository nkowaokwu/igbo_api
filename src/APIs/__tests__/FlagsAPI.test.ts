import {
  dialectFixture,
  outgoingExampleFixture,
  outgoingWordFixture,
} from '../../__tests__/shared/fixtures';
import LanguageEnum from '../../shared/constants/LanguageEnum';
import { SuggestionSourceEnum } from '../../shared/constants/SuggestionSourceEnum';
import { handleWordFlags } from '../FlagsAPI';

describe('FlagsAPI', () => {
  const words = [
    outgoingWordFixture({
      word: 'first word',
      examples: [
        outgoingExampleFixture({
          source: { text: 'first example', language: LanguageEnum.IGBO, pronunciations: [] },
        }),
        outgoingExampleFixture({
          source: {
            text: 'second example',
            language: LanguageEnum.IGBO,
            pronunciations: [],
          },
          origin: SuggestionSourceEnum.INTERNAL,
        }),
        outgoingExampleFixture({
          source: {
            text: 'second example',
            language: LanguageEnum.IGBO,
            pronunciations: [],
          },
          origin: SuggestionSourceEnum.IGBO_SPEECH,
        }),
      ],
    }),
    outgoingWordFixture({
      word: 'second word',
      dialects: [dialectFixture({ word: 'second-word-dialect' })],
    }),
    outgoingWordFixture({
      word: 'third word',
      stems: [outgoingWordFixture({ word: 'first stem' })],
      relatedTerms: [outgoingWordFixture({ word: 'first related term' })],
    }),
  ];

  describe('example flag', () => {
    it('handles enabled example flag and filters on example sentences from the Igbo API Editor Platform', () => {
      const flags = {
        examples: true,
        dialects: false,
        resolve: false,
      };
      // @ts-expect-error different versions
      const result = handleWordFlags({ data: { words, contentLength: words.length }, flags });
      expect(result.words[0].examples).toHaveLength(2);
    });

    it('handles disabled example flag', () => {
      const flags = {
        examples: false,
        dialects: false,
        resolve: false,
      };
      // @ts-expect-error different versions
      const result = handleWordFlags({ data: { words, contentLength: words.length }, flags });
      expect(result.words[0].examples).toBeUndefined();
    });
  });

  describe('dialects flag', () => {
    it('handles enabled dialects flag', () => {
      const flags = {
        examples: false,
        dialects: true,
        resolve: false,
      };
      // @ts-expect-error different versions
      const result = handleWordFlags({ data: { words, contentLength: words.length }, flags });
      expect(result.words[1].dialects).toHaveLength(1);
      // @ts-expect-error dialects
      expect(result.words[1].dialects[0].word).toEqual('second-word-dialect');
    });

    it('handles disabled example flag', () => {
      const flags = {
        examples: false,
        dialects: false,
        resolve: false,
      };
      // @ts-expect-error different versions
      const result = handleWordFlags({ data: { words, contentLength: words.length }, flags });
      expect(result.words[0].dialects).toBeUndefined();
    });
  });

  describe('resolve flag', () => {
    it('handles enabled dialects flag', () => {
      const flags = {
        examples: false,
        dialects: false,
        resolve: true,
      };
      // @ts-expect-error different versions
      const result = handleWordFlags({ data: { words, contentLength: words.length }, flags });
      expect(result.words[2].stems).toHaveLength(1);
      expect(result.words[2].relatedTerms).toHaveLength(1);
      // @ts-expect-error stems
      expect(typeof result.words[2].stems[0]).toEqual('object');
      // @ts-expect-error relatedTerms
      expect(typeof result.words[2].relatedTerms[0]).toEqual('object');
      // @ts-expect-error stems
      expect(result.words[2].stems[0].word).toEqual('first stem');
      // @ts-expect-error relatedTerms
      expect(result.words[2].relatedTerms[0].word).toEqual('first related term');
    });

    it('handles disabled resolve flag', () => {
      const flags = {
        examples: false,
        dialects: false,
        resolve: false,
      };
      // @ts-expect-error different versions
      const result = handleWordFlags({ data: { words, contentLength: words.length }, flags });
      expect(result.words[2].stems).toHaveLength(1);
      // @ts-expect-error stems
      expect(typeof result.words[2].stems[0]).toEqual('string');
      // @ts-expect-error relatedTerms
      expect(typeof result.words[2].relatedTerms[0]).toEqual('string');
    });
  });
});
