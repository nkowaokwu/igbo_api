import { keys, reduce, replace } from 'lodash';

const abbreviations = {
    'adj': 'adjective',
    'aux. v': 'auxiliary verb',
    'cf': 'compare',
    'coll': 'colloquial',
    'conj': 'conjunction',
    'dem': 'demonstrative',
    'E': 'English',
    'enc': 'enclitic',
    'esp': 'especially',
    'ext. stuff': 'inflectional suffix',
    'int': 'interjection',
    'lit': 'literally',
    'n': 'noun',
    'num': 'numeral',
    'p.n': 'proper name',
    'prep': 'preposition',
    'pron': 'pronoun',
    'poss': 'possessive pronoun',
    'quant': 'quantifier',
    'usu': 'usually',
    'v': 'verb',
    'Y': 'derived from Yoruba',
};

const trim = (text) => {
    return replace(text, ':', '');
}

export default (text) => {
    const insertedAbbreviationsText = reduce(keys(abbreviations), (partiallyInsertedAbbreviationsText, abbreviation) => {
        const regExp = new RegExp(`\\b${abbreviation}\\.`);
        return replace(partiallyInsertedAbbreviationsText, regExp, abbreviations[abbreviation]);
    }, trim(text));
    return insertedAbbreviationsText;
};