const EMAILJS_PUBLIC_KEY  = 'M8ZA43Gqp0y_IV69h';   // Account > API Keys
const EMAILJS_SERVICE_ID  = 'service_062sxt9';   // Email Services > Service ID
const EMAILJS_TEMPLATE_ID = 'template_id0n8fi';  // Email Templates > Template ID
// ─────────────────────────────────────────────────────────

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── DOM refs ──────────────────────────────────────────────
const overlay       = document.getElementById('modalOverlay');
const modal         = document.getElementById('modal');
const modalClose    = document.getElementById('modalClose');
const heroContactBtn = document.getElementById('heroContactBtn');
const sendBtn       = document.getElementById('sendBtn');
const formView      = document.getElementById('formView');
const successView   = document.getElementById('successView');
const formError     = document.getElementById('formError');
const inputName     = document.getElementById('inputName');
const inputEmail    = document.getElementById('inputEmail');
const inputMessage  = document.getElementById('inputMessage');

// ── Open / Close ──────────────────────────────────────────
function openModal() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    modalClose.focus();
}

function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');

    // 延遲重置，等動畫結束後再換回表單
    setTimeout(() => {
        formView.classList.remove('hidden');
        successView.classList.add('hidden');
        formError.textContent = '';
        sendBtn.disabled = false;
        sendBtn.textContent = '送出訊息';
        inputName.value = '';
        inputEmail.value = '';
        inputMessage.value = '';
    }, 280);
}

heroContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
});

modalClose.addEventListener('click', closeModal);

// 點遮罩關閉
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

// ESC 關閉
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeModal();
    }
});

// ── 表單驗證 ──────────────────────────────────────────────
function validate() {
    const name    = inputName.value.trim();
    const email   = inputEmail.value.trim();
    const message = inputMessage.value.trim();

    if (!name) {
        formError.textContent = '請填寫你的姓名';
        inputName.focus();
        return null;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formError.textContent = '請填寫有效的 Email';
        inputEmail.focus();
        return null;
    }
    if (!message) {
        formError.textContent = '請填寫訊息內容';
        inputMessage.focus();
        return null;
    }

    formError.textContent = '';
    return { from_name: name, reply_to: email, message };
}

// ── 送出 ──────────────────────────────────────────────────
sendBtn.addEventListener('click', async () => {
    const params = validate();
    if (!params) return;

    sendBtn.disabled = true;
    sendBtn.textContent = '傳送中...';

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
        formView.classList.add('hidden');
        successView.classList.remove('hidden');
    } catch (err) {
        console.error('EmailJS error:', err);
        formError.textContent = '傳送失敗，請稍後再試或直接寄信給我。';
        sendBtn.disabled = false;
        sendBtn.textContent = '送出訊息';
    }
});