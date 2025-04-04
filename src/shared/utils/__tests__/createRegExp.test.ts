/* eslint-disable no-misleading-character-class */
import createRegExp, { removeSpecialCharacters } from '../createRegExp';

describe('createRegExp', () => {
  it('removes special characters', () => {
    const rawSearchWord = '!@#$%&&*()_+=|\\[]{}/~test';
    expect(removeSpecialCharacters(rawSearchWord)).toEqual('test');
  });

  it('creates regexp for a search word', () => {
    const rawSearchWord = 'ngwọ́rọ̄ọ (-da )';
    expect(createRegExp(rawSearchWord)).toEqual({
      definitionsReg:
        /(\W|^)(([nṄǹńNṅǸŃṄǹńṅǸŃ]+[´́`¯̣̄̀]{0,})(g)(w)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})(r)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})([\s'])(-)(d)([aAaàāÀÁĀ]+[´́`¯̣̄̀]{0,})([\s'])(?:es|[sx]|ing)?)(\W|$)/i,
      exampleReg:
        /(\W|^)(([nṄǹńNṅǸŃṄǹńṅǸŃ]+[´́`¯̣̄̀]{0,})(g)(w)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})(r)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})([\s'])(-)(d)([aAaàāÀÁĀ]+[´́`¯̣̄̀]{0,})([\s'])(?:es|[sx]|ing)?)(\W|$)/i,
      hardDefinitionsReg:
        /(\W|^)(([nṄǹńNṅǸŃṄǹńṅǸŃ]+[´́`¯̣̄̀]{0,})(g)(w)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})(r)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})([\s'])(-)(d)([aAaàāÀÁĀ]+[´́`¯̣̄̀]{0,})([\s']))(\W|$)/i,
      wordReg:
        /(\W|^)((?:^|[^a-zA-ZÀ-ụ])([nṄǹńNṅǸŃṄǹńṅǸŃ]+[´́`¯̣̄̀]{0,})(g)(w)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})(r)((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})((([oOòóōọÒÓŌỌ]+[´́`¯̣̄̀]{0,})|[ọỌ])+[´́`¯̣̄̀]{0,})([\s'])(-)(d)([aAaàāÀÁĀ]+[´́`¯̣̄̀]{0,})([\s'])(?:es|[sx]|ing)?)(\W|$)/i,
    });
  });
});
