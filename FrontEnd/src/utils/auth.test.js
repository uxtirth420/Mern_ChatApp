// import test from 'node:test';
// import assert from 'node:assert/strict';

// import { getStoredUser, isTokenExpired } from './auth.js';

// const storage = new Map();

// globalThis.localStorage = {
//   getItem: (key) => (storage.has(key) ? storage.get(key) : null),
//   setItem: (key, value) => storage.set(key, String(value)),
//   removeItem: (key) => storage.delete(key),
//   clear: () => storage.clear(),
// };

// const createToken = (expInSeconds) => {
//   const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
//   const payload = btoa(JSON.stringify({ exp: expInSeconds }));
//   return `${header}.${payload}.signature`;
// };

// test('isTokenExpired returns false for a valid token', () => {
//   const token = createToken(Math.floor(Date.now() / 1000) + 60);
//   assert.equal(isTokenExpired(token), false);
// });

// test('isTokenExpired returns true for an expired token', () => {
//   const token = createToken(Math.floor(Date.now() / 1000) - 60);
//   assert.equal(isTokenExpired(token), true);
// });

// test('getStoredUser removes stale localStorage data and returns null when token is expired', () => {
//   const expiredToken = createToken(Math.floor(Date.now() / 1000) - 60);
//   localStorage.setItem('userInfo', JSON.stringify({ token: expiredToken, name: 'Test User' }));

//   const user = getStoredUser();

//   assert.equal(user, null);
//   assert.equal(localStorage.getItem('userInfo'), null);
// });

// test('getStoredUser returns the stored user when the token is still valid', () => {
//   const validToken = createToken(Math.floor(Date.now() / 1000) + 60);
//   const user = { token: validToken, name: 'Test User' };
//   localStorage.setItem('userInfo', JSON.stringify(user));

//   assert.deepEqual(getStoredUser(), user);
// });
