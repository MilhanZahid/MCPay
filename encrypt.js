const https = require('https');
const crypto = require('crypto');

const CIRCLE_API_KEY = 'TEST_API_KEY:eda0f404ea29b55a2085120eb213400f:4d68ffb29fb4f4b67520e0fe52b38ffd';
const entitySecret = 'a0a05b94539accd3247a4dfc2774f3fd0e1e0e4f0136286f59578bf222e04bb7';

https.get('https://api.circle.com/v1/w3s/config/entity/publicKey', {
  headers: { 'Authorization': 'Bearer ' + CIRCLE_API_KEY }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Raw response:', data);
    const parsed = JSON.parse(data);
    const publicKey = parsed.data.publicKey;
    const encrypted = crypto.publicEncrypt(
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
      Buffer.from(entitySecret, 'hex')
    );
    console.log('YOUR CIPHERTEXT:');
    console.log(encrypted.toString('base64'));
  });
});