// js/ui.js
import { encrypt, decrypt, validateInput } from './hillCipher.js';

/* =========================
   EXPLICACIÓN GENERAL
========================= */
function explainBox(mode = "encrypt") {
  const action = mode === "encrypt" ? "encriptar" : "desencriptar";
  const matrixText = mode === "encrypt" ? "matriz clave" : "matriz inversa";

  return `
    <div class="result-box">
      <div class="result-label">¿Qué está pasando?</div>
      <div style="font-size:13px; line-height:1.6; color:var(--muted);">

        Para ${action} el mensaje con el método Hill:

        <br><br>

        1. Se convierte cada letra en un número según el alfabeto.<br>
        2. Se agrupa en bloques de 3 letras.<br>
        3. Se multiplica cada bloque por la <b>${matrixText}</b>.<br>
        4. Se aplica módulo 28.<br>
        5. Se convierte nuevamente a letras.

      </div>
    </div>
  `;
}

/* =========================
   INIT UI
========================= */
export function initUI() {
  document.getElementById('enc-btn').addEventListener('click', handleEncrypt);
  document.getElementById('dec-btn').addEventListener('click', handleDecrypt);

  document.getElementById('tab-enc').addEventListener('click', () => showTab('enc'));
  document.getElementById('tab-dec').addEventListener('click', () => showTab('dec'));
}

/* =========================
   TABS
========================= */
function showTab(tab) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(tab).classList.add('active');

  // 🔥 LIMPIAR RESULTADOS
  document.getElementById('enc-result').innerHTML = '';
  document.getElementById('dec-result').innerHTML = '';

  const indicator = document.getElementById('mode-indicator');

  if (tab === 'enc') {
    indicator.className = 'mode-indicator encrypt';
    indicator.innerHTML = '🔐 Modo Encriptación';
  } else {
    indicator.className = 'mode-indicator decrypt';
    indicator.innerHTML = '🔓 Modo Desencriptación';
  }
}/* =========================
   RENDER STEPS
========================= */
function renderSteps(steps, mode = "encrypt") {
  const title = mode === "encrypt"
    ? "Multiplicación con matriz clave"
    : "Multiplicación con matriz inversa";

  return steps.map((s, index) => {

    const mapForward = s.block
      .split('')
      .map((c, i) => `${c} → ${s.vec[i]}`)
      .join(' | ');

    const mapBackward = s.res
      .map((n, i) => `${n} → ${s.out[i]}`)
      .join(' | ');

    return `
      <div class="step-card">

        <div class="step-header">
          Bloque ${index + 1}: <b>${s.block}</b>
        </div>

        <div class="step-phase">
          <span>1.</span> Letras a números:
          <div class="step-content">${mapForward}</div>
        </div>

        <div class="step-phase">
          <span>2.</span> ${title} (mod 28):
          <div class="step-content">
            Resultado → [${s.res.join(', ')}]
          </div>
        </div>

        <div class="step-phase">
          <span>3.</span> Números a letras:
          <div class="step-content">${mapBackward}</div>
        </div>

        <div class="step-final">
          Resultado del bloque → <b>${s.out}</b>
        </div>

      </div>
    `;
  }).join('');
}

/* =========================
   ENCRYPT
========================= */
function handleEncrypt() {
  const input = document.getElementById('enc-input').value.trim();
  const el = document.getElementById('enc-result');

  if (!input) return el.innerHTML = error('Ingresa una frase');

  const invalid = validateInput(input);
  if (invalid) return el.innerHTML = error(`Caracter inválido: ${invalid}`);

  const { cipher, padded, steps } = encrypt(input);

  el.innerHTML =
    explainBox("encrypt") +
    resultBox("Mensaje cifrado", cipher) +
    resultBox("Texto con relleno", padded) +
    `<div class="steps">${renderSteps(steps, "encrypt")}</div>`;
}

/* =========================
   DECRYPT
========================= */
function handleDecrypt() {
  const input = document.getElementById('dec-input').value.trim();
  const el = document.getElementById('dec-result');

  if (!input) return el.innerHTML = error('Ingresa texto');

  if (input.length % 3 !== 0)
    return el.innerHTML = error('Debe ser múltiplo de 3');

  const invalid = validateInput(input);
  if (invalid) return el.innerHTML = error(`Caracter inválido: ${invalid}`);

  const res = decrypt(input);
  if (res.error) return el.innerHTML = error(res.error);

  el.innerHTML =
    explainBox("decrypt") +
    resultBox("Mensaje desencriptado", res.plain) +
    `<div class="steps">${renderSteps(res.steps, "decrypt")}</div>`;
}

/* =========================
   RESULT BOX
========================= */
function resultBox(label, value) {
  return `
    <div class="result-box">
      <div class="copy-btn" onclick="navigator.clipboard.writeText('${value}')">📋</div>
      <div class="result-label">${label}</div>
      <div class="result-value">${value}</div>
    </div>
  `;
}

/* =========================
   ERROR
========================= */
const error = msg => `<p class="error">${msg}</p>`;

/* =========================
   AUTO UPPERCASE
========================= */
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') {
    e.target.value = e.target.value.toUpperCase();
  }
});