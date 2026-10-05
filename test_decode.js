const fs = require('fs');

console.time('parse');
const data = fs.readFileSync('js/encoded_photos.js', 'utf8');
const objData = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
const ENCODED_PHOTOS = JSON.parse(objData);
console.timeEnd('parse');

const decodeXOR = (base64Str, key) => {
  const xoredStr = Buffer.from(base64Str, 'base64').toString('binary');
  const len = xoredStr.length;
  const keyLen = key.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = xoredStr.charCodeAt(i) ^ key.charCodeAt(i % keyLen);
  }
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
};

console.time('decode');
let decodedSize = 0;
for (const key in ENCODED_PHOTOS) {
  const decoded = decodeXOR(ENCODED_PHOTOS[key], '0610');
  decodedSize += decoded.length;
}
console.timeEnd('decode');
console.log('Decoded size:', decodedSize);
