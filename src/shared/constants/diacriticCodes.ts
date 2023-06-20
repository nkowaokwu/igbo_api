/* eslint-disable no-multi-spaces */
export const OVERDOT_UPPERCASE_N = 7748; // \u1e44
export const GRAVE_UPPERCASE_N = 504; // \u01f8
export const GRAVE_ACUTE_UPPERCASE_N = 323; // \u0143
export const UNDERDOT_UPPERCASE_I = 7882; // \u1eca
export const UNDERDOT_UPPERCASE_O = 7884; // \u1ecc
export const UNDERDOT_UPPERCASE_U = 7908; // \u1ee4
export const GRAVE_UPPERCASE_A = 192; // \u00c0
export const GRAVE_ACUTE_UPPERCASE_A = 193; // \u00c1
export const MACRON_UPPERCASE_A = 256; // \u0100
export const GRAVE_UPPERCASE_E = 200; // \u00c8
export const GRAVE_ACUTE_UPPERCASE_E = 201; // \u00c9
export const MACRON_UPPERCASE_E = 274; // \u0112
export const GRAVE_UPPERCASE_I = 204; // \u00cc
export const GRAVE_ACUTE_UPPERCASE_I = 205; // \u00cd
export const MACRON_UPPERCASE_I = 298; // \u012a
export const GRAVE_UPPERCASE_O = 210; // \u00d2
export const GRAVE_ACUTE_UPPERCASE_O = 211; // \u00d3
export const MACRON_UPPERCASE_O = 332; // \u014c
export const GRAVE_UPPERCASE_U = 217; // \u00d9
export const GRAVE_ACUTE_UPPERCASE_U = 218; // \u00da
export const MACRON_UPPERCASE_U = 362; // \u016a

export const OVERDOT_LOWERCASE_N = 7749; // \u1e45
export const GRAVE_LOWERCASE_N = 505; // \u01f9
export const GRAVE_ACUTE_LOWERCASE_N = 324; // \u0144
export const UNDERDOT_LOWERCASE_I = 7883; // \u1ecb
export const UNDERDOT_LOWERCASE_O = 7885; // \u1ecd
export const UNDERDOT_LOWERCASE_U = 7909; // \u1ee5
export const GRAVE_LOWERCASE_A = 224; // \u00e0
export const GRAVE_ACUTE_LOWERCASE_A = 225; // \u00e1
export const MACRON_LOWERCASE_A = 257; // \u0101
export const GRAVE_LOWERCASE_E = 232; // \u00e8
export const GRAVE_ACUTE_LOWERCASE_E = 233; // \u00e9
export const MACRON_LOWERCASE_E = 275; // \u0113
export const GRAVE_LOWERCASE_I = 236; // \u00ec
export const GRAVE_ACUTE_LOWERCASE_I = 237; // \u00ed
export const MACRON_LOWERCASE_I = 229; // \u012b
export const GRAVE_LOWERCASE_O = 242; // \u00f2
export const GRAVE_ACUTE_LOWERCASE_O = 243; // \u00f3
export const MACRON_LOWERCASE_O = 333; // \u014d
export const GRAVE_LOWERCASE_U = 249; // \u00f9
export const GRAVE_ACUTE_LOWERCASE_U = 250; // \u00fa
export const MACRON_LOWERCASE_U = 363; // \u016b

export const cjkRange = '[\u4E00-\u9FFF]';
const caseInsensitiveN = `${'[n\u1e44\u01f9\u0144N\u1e45\u01f8\u0143'.normalize(
  'NFD'
)}${'\u1e44\u01f9\u0144\u1e45\u01f8\u0143]'.normalize('NFC')}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveM = `${'[m\u1e44\u01f9\u0144M\u1e45\u01f8\u0143'.normalize(
  'NFD'
)}${'\u1e44\u01f9\u0144\u1e45\u01f8\u0143]'.normalize('NFC')}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveA = `${'[aA'}${'\u0061\u00e0\u0101\u00c0\u00c1\u0100]'.normalize(
  'NFC'
)}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveE = `${'[eE'}${'\u00e8\u00e9\u0113\u00c8\u00c9\u0112]'.normalize(
  'NFC'
)}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveI = `${'[iI'}${'\u00ec\u00ed\u012b\u1ecb\u00cc\u00cd\u012a\u1eca]'.normalize(
  'NFC'
)}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveỊ = `${'(([iI]+[\u0323]{0,})|[\u1ECB\u1ECA])'}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveO = `${'[oO'}${'\u00f2\u00f3\u014d\u1ecd\u00d2\u00d3\u014c\u1ecc]'.normalize(
  'NFC'
)}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveỌ = `${'(([oO]+[\u0323]{0,})|[\u1ECD\u1ECC])'}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveU = `${'[uU'}${'\u00f9\u00fa\u016b\u1ee5\u00d9\u00da\u016a\u1ee4]'.normalize(
  'NFC'
)}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;
const caseInsensitiveỤ = `${'(([uU]+[\u0323]{0,})|[\u1EE5\u1EE4])'}+[\u00B4\u0301\u0060\u00AF\u0304\u0323\u0300]{0,}`;

export default {
  n: caseInsensitiveN,
  N: caseInsensitiveN,
  m: caseInsensitiveM,
  M: caseInsensitiveM,
  a: caseInsensitiveA,
  A: caseInsensitiveA,
  e: caseInsensitiveE,
  E: caseInsensitiveE,
  i: caseInsensitiveI,
  I: caseInsensitiveI,
  ị: caseInsensitiveỊ,
  Ị: caseInsensitiveỊ,
  o: caseInsensitiveO,
  O: caseInsensitiveO,
  ọ: caseInsensitiveỌ,
  Ọ: caseInsensitiveỌ,
  u: caseInsensitiveU,
  U: caseInsensitiveU,
  ụ: caseInsensitiveỤ,
  Ụ: caseInsensitiveỤ,
  ' ': '[\\s\u0027]',
  '?': '\\?',
};
