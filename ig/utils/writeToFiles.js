import fs from 'fs';
import { parse } from 'node-html-parser';
import { READ_FILE, READ_FILE_FORMAT, DICTIONARIES_DIR } from '../../shared/constants/parseFileLocations';

export default ({
    buildDictionaries,
    normalizationMap,
}) => {
    const caseSensitiveDictionary = {};
    const caseSensitiveNormalizedDictionary = {};
    
    if (!fs.existsSync(DICTIONARIES_DIR)){
        fs.mkdirSync(DICTIONARIES_DIR);
    }

    fs.readFile(READ_FILE, READ_FILE_FORMAT, (err, data) => {
        if (err) {
            throw new Error('Unable to read file', err);
        }
        const root = parse(data);
    
        buildDictionaries(root, caseSensitiveDictionary);
        buildDictionaries(root, caseSensitiveNormalizedDictionary, { normalize: true });
    
        const writeFileConfigs = [
            [`${DICTIONARIES_DIR}/ig-en_expanded.json`, JSON.stringify(caseSensitiveDictionary, null, 4)],
            [`${DICTIONARIES_DIR}/ig-en_normalized_expanded.json`, JSON.stringify(caseSensitiveNormalizedDictionary, null, 4)],
            [`${DICTIONARIES_DIR}/ig-en_normalized.json`, JSON.stringify(caseSensitiveNormalizedDictionary)],
            [`${DICTIONARIES_DIR}/ig-en.json`, JSON.stringify(caseSensitiveDictionary)],
        ];
    
        console.log({ normalizationMap });
    
        writeFileConfigs.forEach((config) => {
            fs.writeFile(...config, () => {
                if (err) {
                    throw new Error('An error occurred during writing the dictionary');
                }
                console.log(`${config[0]} has been saved`);
            });
        })
    });
}