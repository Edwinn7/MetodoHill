// js/hillCipher.js

const ALPHA = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ_';
const MOD = 28;
const KEY = [[4,3,1],[2,2,1],[1,1,1]];

const charToNum = c => ALPHA.indexOf(c);
const numToChar = n => ALPHA[((n % MOD) + MOD) % MOD];

const matMul = (M, v) => M.map(row =>
  row.reduce((s, val, i) => s + val * v[i], 0)
);

const modVec = v => v.map(x => ((x % MOD) + MOD) % MOD);

const modInverse = (a, m) => {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
};

const matInvMod = (M, m) => {
  const det = M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])
             -M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])
             +M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);

  const detInv = modInverse(((det % m) + m) % m, m);
  if (detInv === null) return null;

  const adj = [
    [ (M[1][1]*M[2][2]-M[1][2]*M[2][1]), -(M[0][1]*M[2][2]-M[0][2]*M[2][1]),  (M[0][1]*M[1][2]-M[0][2]*M[1][1])],
    [-(M[1][0]*M[2][2]-M[1][2]*M[2][0]),  (M[0][0]*M[2][2]-M[0][2]*M[2][0]), -(M[0][0]*M[1][2]-M[0][2]*M[1][0])],
    [ (M[1][0]*M[2][1]-M[1][1]*M[2][0]), -(M[0][0]*M[2][1]-M[0][1]*M[2][0]),  (M[0][0]*M[1][1]-M[0][1]*M[1][0])]
  ];

  return adj.map(row => row.map(x => ((x * detInv) % m + m) % m));
};

const validateInput = (text) => {
  for (let c of text) {
    if (charToNum(c) === -1) return c;
  }
  return null;
};

export function encrypt(raw) {
  let msg = raw;
  while (msg.length % 3 !== 0) msg += '_';

  let cipher = '';
  let steps = [];

  for (let i = 0; i < msg.length; i += 3) {
    const block = msg.slice(i, i+3);
    const vec = block.split('').map(charToNum);
    const res = modVec(matMul(KEY, vec));
    const out = res.map(numToChar).join('');

    cipher += out;
    steps.push({ block, vec, res, out });
  }

  return { cipher, padded: msg, steps };
}

export function decrypt(raw) {
  const inv = matInvMod(KEY, MOD);
  if (!inv) return { error: 'Matriz no invertible' };

  let plain = '';
  let steps = [];

  for (let i = 0; i < raw.length; i += 3) {
    const block = raw.slice(i, i+3);
    const vec = block.split('').map(charToNum);
    const res = modVec(matMul(inv, vec));
    const out = res.map(numToChar).join('');

    plain += out;
    steps.push({ block, vec, res, out });
  }

  return { plain, steps };
}

export { validateInput };