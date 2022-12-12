import CryptoJS from 'crypto-js';

// 默认的 KEY 与 iv
const KEY = CryptoJS.MD5('1234567890ABCDEFABCDEf1234567890');
const IV = CryptoJS.MD5('012345ABCDEF6789');

/**
 * AES加密
 * @param {*} word
 * @returns
 */
export function Encrypt(word) {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}

/**
 * AES 解密
 * @param {*} word
 * @returns
 */
export function Decrypt(word) {
  const src = CryptoJS.format.Hex.parse(word);

  const decrypt = CryptoJS.AES.decrypt(src, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return CryptoJS.enc.Utf8.stringify(decrypt);
}
