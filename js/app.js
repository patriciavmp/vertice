/**
 * ==========================================================================
 * VÉRTICE - Red de Confianza UPC
 * Aplicación Principal y Lógica de Negocio SPA
 * ==========================================================================
 */

// 1. ESTADO GLOBAL DE LA APLICACIÓN
const appState = {
    code: null,
    role: null, // 'student' | 'admin'
    currentLoginTab: 'student',
    service: {
        name: '',
        category: '',
        district: '',
        price: 0,
        date: ''
    },
    paymentMethod: 'yape',
    chatInitialized: false,
    currentView: 'view-landing'
};

// 2. SISTEMA DE NOTIFICACIONES (TOASTS)
function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon} text-lg"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

// 3. ENRUTADOR Y SISTEMA DE NAVEGACIÓN SPA
function navigate(viewId) {
    // Protección de seguridad para el Panel del Conserje
    if (viewId === 'view-admin' && appState.role !== 'admin') {
        showToast('Acceso restringido: Se requieren credenciales de Conserje', 'error');
        navigate('view-login');
        setLoginTab('admin');
        return;
    }

    const views = document.querySelectorAll('.view-section');
    views.forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    });

    const target = document.getElementById(viewId);
    if (!target) return;

    if (target.dataset.layout === 'flex') {
        target.classList.remove('hidden');
        target.classList.add('flex');
    } else {
        target.classList.remove('hidden');
    }

    appState.currentView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Cerrar menú móvil si está abierto
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }

    // Acciones específicas por vista
    if (viewId === 'view-catalog') {
        renderCatalog();
    } else if (viewId === 'view-admin') {
        renderAdmin();
    }
}

// Alternar menú de navegación móvil
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// 4. SISTEMA DE AUTENTICACIÓN Y ROLES (ALUMNO UPC & CONSERJE)
function setLoginTab(tab) {
    appState.currentLoginTab = tab;
    const tabStudent = document.getElementById('tab-student');
    const tabAdmin = document.getElementById('tab-admin');
    const studentHeader = document.getElementById('login-student-header');
    const adminHeader = document.getElementById('login-admin-header');
    const groupStudent = document.getElementById('input-group-student');
    const groupAdmin = document.getElementById('input-group-admin');
    const submitBtnSpan = document.querySelector('#login-submit-btn span');
    const loginIcon = document.getElementById('login-icon');

    const studentError = document.getElementById('login-error');
    const adminError = document.getElementById('admin-error');
    if (studentError) studentError.classList.add('hidden');
    if (adminError) adminError.classList.add('hidden');

    const studentInput = document.getElementById('upc-input');
    const adminInput = document.getElementById('admin-input');

    if (tab === 'student') {
        if (tabStudent) {
            tabStudent.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm bg-white text-gray-900 flex items-center justify-center gap-1.5 cursor-pointer';
        }
        if (tabAdmin) {
            tabAdmin.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl transition-all text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 cursor-pointer';
        }
        if (studentHeader) studentHeader.classList.remove('hidden');
        if (adminHeader) adminHeader.classList.add('hidden');
        if (groupStudent) groupStudent.classList.remove('hidden');
        if (groupAdmin) groupAdmin.classList.add('hidden');
        if (submitBtnSpan) submitBtnSpan.innerText = 'Validar Identidad UPC';
        if (loginIcon) loginIcon.className = 'fa-solid fa-graduation-cap';
        if (studentInput) {
            studentInput.required = true;
            setTimeout(() => studentInput.focus(), 60);
        }
        if (adminInput) adminInput.required = false;
    } else {
        if (tabStudent) {
            tabStudent.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl transition-all text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 cursor-pointer';
        }
        if (tabAdmin) {
            tabAdmin.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm bg-white text-gray-900 flex items-center justify-center gap-1.5 cursor-pointer';
        }
        if (studentHeader) studentHeader.classList.add('hidden');
        if (adminHeader) adminHeader.classList.remove('hidden');
        if (groupStudent) groupStudent.classList.add('hidden');
        if (groupAdmin) groupAdmin.classList.remove('hidden');
        if (submitBtnSpan) submitBtnSpan.innerText = 'Ingresar como Conserje';
        if (loginIcon) loginIcon.className = 'fa-solid fa-user-shield';
        if (adminInput) {
            adminInput.required = true;
            setTimeout(() => adminInput.focus(), 60);
        }
        if (studentInput) studentInput.required = false;
    }
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById('eye-icon-admin');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('nav-login-btn');
    const userBadge = document.getElementById('nav-user-badge');
    const userCode = document.getElementById('nav-user-code');
    const userIcon = document.getElementById('nav-user-icon');
    const navAdminLink = document.getElementById('nav-admin-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');

    if (appState.code) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userBadge) {
            userBadge.classList.remove('hidden');
            userBadge.classList.add('flex');
        }
        if (userCode) userCode.innerText = appState.code;

        if (appState.role === 'admin') {
            if (userIcon) userIcon.className = 'fa-solid fa-user-shield text-emerald-600';
            if (navAdminLink) {
                navAdminLink.classList.remove('hidden');
                navAdminLink.classList.add('flex');
            }
            if (mobileAdminLink) {
                mobileAdminLink.classList.remove('hidden');
                mobileAdminLink.classList.add('flex');
            }
        } else {
            if (userIcon) userIcon.className = 'fa-solid fa-shield-check text-emerald-600';
            if (navAdminLink) {
                navAdminLink.classList.add('hidden');
                navAdminLink.classList.remove('flex');
            }
            if (mobileAdminLink) {
                mobileAdminLink.classList.add('hidden');
                mobileAdminLink.classList.remove('flex');
            }
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userBadge) {
            userBadge.classList.add('hidden');
            userBadge.classList.remove('flex');
        }
        if (navAdminLink) {
            navAdminLink.classList.add('hidden');
            navAdminLink.classList.remove('flex');
        }
        if (mobileAdminLink) {
            mobileAdminLink.classList.add('hidden');
            mobileAdminLink.classList.remove('flex');
        }
    }
}

function handleLogin(e) {
    e.preventDefault();

    // Modo Conserje / Administrador
    if (appState.currentLoginTab === 'admin') {
        const adminInput = document.getElementById('admin-input');
        const adminError = document.getElementById('admin-error');
        const code = adminInput ? adminInput.value.trim() : '';

        const validAdminCodes = ['ADMIN2026', 'CONSERJE', 'ADMIN', 'CONSERJE-UPC', 'UPC-ADMIN'];
        if (validAdminCodes.includes(code.toUpperCase())) {
            if (adminError) adminError.classList.add('hidden');
            appState.code = 'CONSERJE';
            appState.role = 'admin';

            updateAuthUI();
            showToast('Sesión de Conserje iniciada con éxito', 'success');
            navigate('view-admin');
            if (adminInput) adminInput.value = '';
        } else {
            if (adminError) adminError.classList.remove('hidden');
            showToast('Credencial de Conserje no autorizada', 'error');
        }
        return;
    }

    // Modo Alumno UPC
    const inputEl = document.getElementById('upc-input');
    const errorEl = document.getElementById('login-error');
    if (!inputEl) return;

    const input = inputEl.value.trim().toLowerCase();

    // Atajo inteligente si escribe código admin en la pestaña de alumno
    if (['admin2026', 'conserje', 'admin'].includes(input)) {
        if (errorEl) errorEl.classList.add('hidden');
        appState.code = 'CONSERJE';
        appState.role = 'admin';
        updateAuthUI();
        showToast('Credencial de Conserje detectada. Bienvenido.', 'success');
        navigate('view-admin');
        inputEl.value = '';
        return;
    }
    
    // Regla UPC: Comienza con u/U seguido de 8 a 9 caracteres alfanuméricos
    const regex = /^[uU][a-zA-Z0-9]{8,9}$/;

    if (regex.test(input)) {
        if (errorEl) errorEl.classList.add('hidden');
        appState.code = input.toUpperCase();
        appState.role = 'student';

        updateAuthUI();
        showToast(`Identidad UPC validada: ${appState.code}`, 'success');
        navigate('view-catalog');
        inputEl.value = '';
    } else {
        if (errorEl) errorEl.classList.remove('hidden');
        showToast('Código inválido. Formato: u seguido de 8 a 9 caracteres', 'error');
    }
}

function handleLogout() {
    appState.code = null;
    appState.role = null;
    updateAuthUI();

    showToast('Sesión cerrada correctamente', 'info');
    navigate('view-landing');
}

// 5. MOTOR DE CATÁLOGO Y FILTROS DINÁMICOS
function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    const countLabel = document.getElementById('results-count');
    if (!grid) return;

    const checkedBoxes = document.querySelectorAll('.category-filter:checked');
    const checkedCats = Array.from(checkedBoxes).map(cb => cb.value);
    const selDistrict = document.getElementById('filter-district')?.value || 'Todos';
    const priceSlider = document.getElementById('filter-price');
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 100;

    const filtered = DB_SERVICES.filter(srv => {
        const matchCat = checkedCats.includes(srv.category);
        const matchDist = selDistrict === 'Todos' || srv.districts.includes(selDistrict) || srv.districts.includes('Todos');
        const matchPrice = srv.price <= maxPrice;
        return matchCat && matchDist && matchPrice;
    });

    grid.innerHTML = '';
    if (countLabel) {
        countLabel.innerText = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <div class="w-16 h-16 mx-auto bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-slate-100">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <p class="text-slate-600 font-semibold text-base">No hay especialistas que coincidan con estos filtros.</p>
                <p class="text-slate-400 text-xs mt-1">Intenta ajustando el rango de tarifa o seleccionando otras categorías.</p>
                <button onclick="clearFilters()" class="mt-5 btn-press text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all">
                    <i class="fa-solid fa-rotate-left"></i> Restablecer filtros
                </button>
            </div>`;
        return;
    }

    // Helper de estilo de insignia por categoría
    function getCategoryStyle(cat) {
        switch (cat) {
            case 'Cursos y Tutorías':
                return { icon: 'fa-graduation-cap', badge: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/60' };
            case 'Tareas y Entregables':
                return { icon: 'fa-list-check', badge: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/60' };
            case 'Tesis y Redacción':
                return { icon: 'fa-book-open-reader', badge: 'bg-amber-50/90 text-amber-800 border-amber-200/60' };
            case 'Software y Diseño':
                return { icon: 'fa-laptop-code', badge: 'bg-purple-50/90 text-purple-700 border-purple-200/60' };
            default:
                return { icon: 'fa-certificate', badge: 'bg-slate-50 text-slate-700 border-slate-200/60' };
        }
    }

    filtered.forEach((srv, index) => {
        const style = getCategoryStyle(srv.category);
        const card = document.createElement('div');
        card.className = 'interactive-card bg-white p-6 md:p-7 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card-hover hover:border-emerald-500/40 flex flex-col justify-between group transition-all';
        card.style.animationDelay = `${index * 40}ms`;
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-4">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border ${style.badge}">
                        <i class="fa-solid ${style.icon} text-[10px]"></i> ${srv.category}
                    </span>
                    <span class="inline-flex items-center gap-1 text-xs font-black bg-amber-50/90 border border-amber-200/60 text-amber-800 px-2.5 py-0.5 rounded-full shadow-xs">
                        <i class="fa-solid fa-star text-amber-400 text-[10px]"></i> ${srv.rating}
                    </span>
                </div>
                <h4 class="font-bold text-lg md:text-xl text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">${srv.title}</h4>
                <p class="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">${srv.desc}</p>
                
                <div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span class="inline-flex items-center gap-1.5 font-medium">
                        <i class="fa-solid fa-location-dot text-emerald-600 text-xs"></i> ${srv.districts.join(', ')}
                    </span>
                    <span class="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border border-emerald-100">
                        <i class="fa-solid fa-shield-check text-[10px]"></i> Verificado
                    </span>
                </div>
            </div>
            <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tarifa Base</span>
                    <span class="font-black text-slate-900 text-2xl tracking-tight">S/ ${srv.price}<span class="text-xs font-semibold text-slate-400">/h</span></span>
                </div>
                <button onclick="goToRequest('${srv.title}', '${srv.category}', ${srv.price}, '${selDistrict}')" 
                    class="btn-press bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 group-hover:gap-2.5 cursor-pointer">
                    <span>Cotizar</span>
                    <i class="fa-solid fa-arrow-right text-[10px] transition-transform"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function clearFilters() {
    document.querySelectorAll('.category-filter').forEach(cb => cb.checked = true);
    const distEl = document.getElementById('filter-district');
    if (distEl) distEl.value = 'Todos';

    const priceEl = document.getElementById('filter-price');
    const priceDisplay = document.getElementById('price-display');
    if (priceEl) priceEl.value = 100;
    if (priceDisplay) priceDisplay.innerText = 'S/ 100/h';

    renderCatalog();
    showToast('Filtros restablecidos', 'info');
}

// 6. FLUJO DE SOLICITUD AL CONSERJE
function goToRequest(name, category, price, district) {
    if (!appState.code) {
        showToast('Acceso Restringido: Ingresa tu código UPC primero', 'error');
        navigate('view-login');
        return;
    }

    appState.service.name = name;
    appState.service.category = category;
    appState.service.price = price;

    const reqService = document.getElementById('req-service');
    if (reqService) reqService.value = name;

    const selectDistrict = document.getElementById('req-district');
    if (selectDistrict && district !== 'Todos') {
        Array.from(selectDistrict.options).forEach(opt => {
            if (opt.value === district) selectDistrict.value = district;
        });
    }

    navigate('view-request');
}

// Formateador legible para fecha, hora y ocasión de la reserva
function formatServiceDateTime(dateStr, timeStr, occasionStr) {
    if (!dateStr) return 'Próxima fecha a convenir';
    const parts = dateStr.split('-');
    let formatted = dateStr;
    if (parts.length === 3) {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
        const day = parseInt(parts[2], 10);
        const month = months[parseInt(parts[1], 10) - 1] || '';
        const year = parts[0];
        formatted = `${day} ${month} ${year}`;
    }
    if (timeStr) {
        formatted += ` • ${timeStr} hrs`;
    }
    if (occasionStr) {
        formatted += ` (${occasionStr})`;
    }
    return formatted;
}

function submitRequest(e) {
    e.preventDefault();

    const formArea = document.getElementById('request-form-area');
    const loadingArea = document.getElementById('request-loading');

    const rawDate = document.getElementById('req-date')?.value;
    const rawTime = document.getElementById('req-time')?.value;
    const rawOccasion = document.getElementById('req-occasion')?.value?.trim();

    appState.service.date = formatServiceDateTime(rawDate, rawTime, rawOccasion);
    appState.service.district = document.getElementById('req-district')?.value || 'San Isidro';

    // Rellenar datos en vistas siguientes
    const specServiceName = document.getElementById('spec-service-name');
    const specPrice = document.getElementById('spec-price');
    const payService = document.getElementById('pay-service');
    const payDate = document.getElementById('pay-date');
    const payDistrict = document.getElementById('pay-district');
    const pdfCode = document.getElementById('pdf-code');
    const pdfService = document.getElementById('pdf-service');
    const pdfDateDist = document.getElementById('pdf-date-dist');

    if (specServiceName) specServiceName.innerText = appState.service.name;
    if (specPrice) specPrice.innerHTML = `S/ ${appState.service.price}<span class="text-sm font-semibold text-gray-400">/h</span>`;
    if (payService) payService.innerText = appState.service.name;
    if (payDate) payDate.innerText = appState.service.date;
    if (payDistrict) payDistrict.innerText = appState.service.district;

    if (pdfCode) pdfCode.innerText = appState.code;
    if (pdfService) pdfService.innerText = appState.service.name;
    if (pdfDateDist) pdfDateDist.innerText = `${appState.service.date} • ${appState.service.district}`;

    // Efecto de curaduría por el conserje
    if (formArea && loadingArea) {
        formArea.style.opacity = '0';
        setTimeout(() => {
            formArea.classList.add('hidden');
            loadingArea.classList.remove('hidden');
        }, 200);

        setTimeout(() => {
            loadingArea.classList.add('hidden');
            formArea.classList.remove('hidden');
            formArea.style.opacity = '1';
            navigate('view-specialist');
        }, 2200);
    } else {
        navigate('view-specialist');
    }
}

// 7. SIMULACIÓN INTERACTIVA DE WHATSAPP CON EL CONSERJE
function startChat() {
    navigate('view-chat');
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    chatBox.innerHTML = '';

    const defaultCode = appState.code || 'u20261029';
    const defaultServiceName = appState.service.name || 'Servicio de Confianza';
    const defaultDistrict = appState.service.district || 'Lima';

    const messages = [
        { sender: 'bot', text: `¡Hola! Soy el Conserje VÉRTICE. He validado tu código institucional (${defaultCode}).` },
        { sender: 'bot', text: `Tengo listo a tu especialista rigurosamente verificado (A-014) para el servicio de *${defaultServiceName}* en *${defaultDistrict}*.` },
        { sender: 'user', text: `¡Excelente! ¿Cuál es el siguiente paso para confirmar?` },
        { 
            sender: 'bot', 
            html: `
                <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] w-full">
                    <div class="flex justify-between items-start border-b pb-2 mb-3">
                        <p class="font-extrabold text-gray-900 text-sm">Reserva Especialista A-014</p>
                        <i class="fa-solid fa-shield-check text-emerald-500"></i>
                    </div>
                    <p class="text-[10px] text-gray-400 mb-1 uppercase tracking-widest font-bold">Seña de seguridad</p>
                    <p class="text-xl font-black text-gray-900 mb-4">S/ ${APP_CONFIG.defaultDeposit.toFixed(2)}</p>
                    <button onclick="navigate('view-payment')" class="w-full bg-[#00A884] hover:bg-[#075E54] transition-colors text-white text-xs font-bold py-3 rounded-lg uppercase tracking-wider shadow-sm flex items-center justify-center gap-2">
                        <i class="fa-solid fa-lock"></i> Pagar Seña Segura
                    </button>
                </div>` 
        }
    ];

    let delay = 400;
    messages.forEach(msg => {
        setTimeout(() => {
            appendChatMessage(msg);
        }, delay);
        delay += (msg.sender === 'user' ? 800 : 1200);
    });
}

function appendChatMessage(msg) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    const row = document.createElement('div');
    row.className = `flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble max-w-[85%] p-3.5 text-sm shadow-sm font-medium ${
        msg.sender === 'user'
            ? 'bg-[#D9FDD3] text-gray-800 rounded-2xl rounded-tr-sm chat-bubble-right'
            : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-50'
    }`;

    if (msg.html) {
        bubble.innerHTML = msg.html;
    } else {
        bubble.innerHTML = msg.text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    }

    const time = document.createElement('div');
    time.className = 'text-[9px] text-gray-400 mt-1 text-right font-bold flex justify-end items-center gap-1';
    const now = new Date();
    time.innerHTML = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${
        msg.sender === 'user' ? '<i class="fa-solid fa-check-double text-blue-500"></i>' : ''
    }`;
    bubble.appendChild(time);

    row.appendChild(bubble);
    chatBox.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Enviar mensaje interactivo por el chat
function sendUserChatMessage() {
    const input = document.getElementById('chat-user-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage({ sender: 'user', text });
    input.value = '';

    // Respuesta inteligente automática del bot conserje
    setTimeout(() => {
        let reply = "Entendido, estoy coordinando los detalles con el tutor para asegurar el cumplimiento de tu entrega académica.";
        const lower = text.toLowerCase();
        if (lower.includes('seguridad') || lower.includes('verificado') || lower.includes('confianza')) {
            reply = "Todos los tutores y especialistas son estudiantes de últimos ciclos o egresados UPC con récord académico destacado y verificación al 100%.";
        } else if (lower.includes('precio') || lower.includes('pago') || lower.includes('costo')) {
            reply = "La seña es de S/ 15.00 para congelar la tarifa preferencial y desbloquear datos de contacto directos.";
        } else if (lower.includes('gracias') || lower.includes('ok')) {
            reply = "¡A tu servicio! Puedes proceder al pago de la seña cuando gustes.";
        }
        appendChatMessage({ sender: 'bot', text: reply });
    }, 900);
}

// 8. PASARELA Y TABS DE PAGO (YAPE / PLIN)
function switchPaymentTab(method) {
    appState.paymentMethod = method;
    const tabYape = document.getElementById('tab-yape');
    const tabPlin = document.getElementById('tab-plin');
    const qrContainer = document.getElementById('qr-container');
    const qrIcon = document.getElementById('qr-icon');
    const qrLabel = document.getElementById('qr-label');

    if (!tabYape || !tabPlin || !qrContainer || !qrIcon || !qrLabel) return;

    if (method === 'yape') {
        tabYape.className = 'flex-1 pb-4 border-b-2 border-purple-600 text-purple-700 font-black text-sm uppercase tracking-wide transition-colors text-center';
        tabPlin.className = 'flex-1 pb-4 border-b-2 border-transparent text-gray-400 font-semibold text-sm uppercase tracking-wide hover:text-gray-600 transition-colors text-center';
        qrContainer.className = 'w-40 h-40 mx-auto bg-purple-50 rounded-[2rem] mt-8 border border-purple-100 flex items-center justify-center text-8xl transition-colors duration-300 shadow-sm';
        qrIcon.className = 'fa-solid fa-qrcode text-purple-600/70';
        qrLabel.className = 'text-[10px] font-black text-purple-600 mt-4 uppercase tracking-widest bg-purple-50 inline-block px-3 py-1 rounded-md';
        qrLabel.innerText = 'Escanea con Yape';
    } else {
        tabPlin.className = 'flex-1 pb-4 border-b-2 border-cyan-500 text-cyan-600 font-black text-sm uppercase tracking-wide transition-colors text-center';
        tabYape.className = 'flex-1 pb-4 border-b-2 border-transparent text-gray-400 font-semibold text-sm uppercase tracking-wide hover:text-gray-600 transition-colors text-center';
        qrContainer.className = 'w-40 h-40 mx-auto bg-cyan-50 rounded-[2rem] mt-8 border border-cyan-100 flex items-center justify-center text-8xl transition-colors duration-300 shadow-sm';
        qrIcon.className = 'fa-solid fa-qrcode text-cyan-500/70';
        qrLabel.className = 'text-[10px] font-black text-cyan-600 mt-4 uppercase tracking-widest bg-cyan-50 inline-block px-3 py-1 rounded-md';
        qrLabel.innerText = 'Escanea con Plin';
    }
}

function handleVoucherChange(input) {
    const nameEl = document.getElementById('voucher-name');
    if (!nameEl) return;
    if (input.files && input.files[0]) {
        nameEl.innerText = '✓ ' + input.files[0].name;
        nameEl.className = 'text-sm text-emerald-600 font-bold';
    } else {
        nameEl.innerText = 'Click para adjuntar voucher';
        nameEl.className = 'text-sm text-gray-500 font-semibold';
    }
}

function submitPayment(e) {
    e.preventDefault();
    const voucherInput = document.getElementById('voucher');
    if (!voucherInput || !voucherInput.files.length) {
        showToast('Por seguridad, debes adjuntar la captura del comprobante para continuar', 'error');
        return;
    }

    // Registrar en solicitudes del panel admin
    const newId = `S-00${DB_ADMIN_REQUESTS.length + 1}`;
    DB_ADMIN_REQUESTS.unshift({
        id: newId,
        code: appState.code || 'u20261029',
        service: appState.service.name || 'Servicio Confirmado',
        status: 'Confirmado',
        statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        date: new Date().toLocaleDateString('es-PE'),
        district: appState.service.district || 'San Isidro'
    });

    showToast('Abono registrado con éxito. Generando constancia digital...', 'success');
    navigate('view-constancia');
}

// 9. CONSTANCIA DIGITAL Y EXPORTACIÓN PDF
function downloadPDF() {
    const element = document.getElementById('pdf-area');
    if (!element) return;

    const fileName = appState.code 
        ? `VERTICE_Constancia_Reserva_${appState.code}.pdf` 
        : `VERTICE_Constancia_Reserva.pdf`;

    showToast('Preparando descarga en PDF...', 'info');

    const opt = {
        margin: 0.25,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save().then(() => {
            showToast('PDF descargado exitosamente', 'success');
        }).catch(err => {
            console.error('Error generando PDF:', err);
            window.print();
        });
    } else {
        window.print();
    }
}

// 10. PANEL DE ADMINISTRACIÓN INTERNA DEL CONSERJE
function renderAdmin() {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    DB_ADMIN_REQUESTS.forEach(req => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-sm';
        row.innerHTML = `
            <td class="p-4 font-mono text-slate-500 font-semibold text-xs">${req.id}</td>
            <td class="p-4 font-bold text-slate-900">${req.code}</td>
            <td class="p-4 text-slate-700 font-medium">${req.service}</td>
            <td class="p-4">
                <span class="${req.statusClass} px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 border">
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    ${req.status}
                </span>
            </td>
            <td class="p-4 text-right">
                <button onclick="navigate('view-chat')" class="btn-press inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer">
                    <i class="fa-brands fa-whatsapp text-xs"></i>
                    <span>Ver chat</span>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 11. INICIALIZACIÓN Y EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Listeners para filtros de catálogo
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.addEventListener('change', renderCatalog);
    });

    const distFilter = document.getElementById('filter-district');
    if (distFilter) distFilter.addEventListener('change', renderCatalog);

    const priceSlider = document.getElementById('filter-price');
    const priceDisplay = document.getElementById('price-display');
    if (priceSlider && priceDisplay) {
        priceSlider.addEventListener('input', (e) => {
            priceDisplay.innerText = `S/ ${e.target.value}/h`;
            renderCatalog();
        });
    }

    // Input de chat interactivo con Enter
    const chatInput = document.getElementById('chat-user-input');
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendUserChatMessage();
            }
        });
    }

    // Configurar selector de fecha mínima (hoy) para la reserva
    const reqDateInput = document.getElementById('req-date');
    if (reqDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        reqDateInput.min = `${yyyy}-${mm}-${dd}`;

        // Fecha sugerida por defecto: mañana
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tYyyy = tomorrow.getFullYear();
        const tMm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tDd = String(tomorrow.getDate()).padStart(2, '0');
        reqDateInput.value = `${tYyyy}-${tMm}-${tDd}`;
    }

    // Renderizar catálogo inicial
    renderCatalog();
});
