/**
 * ==========================================================================
 * VÉRTICE - Red de Confianza UPC
 * Aplicación Principal y Lógica de Negocio SPA
 * ==========================================================================
 */

// 1. ESTADO GLOBAL DE LA APLICACIÓN
const appState = {
    code: null,
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

    // Sincronizar selector de navegación de desarrollo
    const devNav = document.getElementById('dev-nav');
    if (devNav) devNav.value = viewId;

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

// 4. AUTENTICACIÓN Y VALIDACIÓN UPC
function handleLogin(e) {
    e.preventDefault();
    const inputEl = document.getElementById('upc-input');
    const errorEl = document.getElementById('login-error');
    if (!inputEl) return;

    const input = inputEl.value.trim().toLowerCase();
    
    // Regla UPC: Comienza con u/U seguido de 8 a 9 caracteres alfanuméricos
    const regex = /^[uU][a-zA-Z0-9]{8,9}$/;

    if (regex.test(input)) {
        if (errorEl) errorEl.classList.add('hidden');
        appState.code = input.toUpperCase();

        // Actualizar barra de navegación
        const loginBtn = document.getElementById('nav-login-btn');
        const userBadge = document.getElementById('nav-user-badge');
        const userCode = document.getElementById('nav-user-code');

        if (loginBtn) loginBtn.classList.add('hidden');
        if (userBadge) userBadge.classList.remove('hidden');
        if (userCode) userCode.innerText = appState.code;

        showToast(`Identidad UPC validada: ${appState.code}`, 'success');
        navigate('view-catalog');
    } else {
        if (errorEl) errorEl.classList.remove('hidden');
        showToast('Código inválido. Formato: u seguido de 8 a 9 caracteres', 'error');
    }
}

function handleLogout() {
    appState.code = null;
    const loginBtn = document.getElementById('nav-login-btn');
    const userBadge = document.getElementById('nav-user-badge');
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userBadge) userBadge.classList.add('hidden');

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
            <div class="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <i class="fa-solid fa-folder-open text-5xl mb-4 text-gray-300"></i>
                <p class="text-gray-500 font-medium">No hay especialistas que coincidan con estos filtros.</p>
                <button onclick="clearFilters()" class="mt-4 text-emerald-600 text-sm font-bold hover:underline inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-rotate-left"></i> Restablecer filtros
                </button>
            </div>`;
        return;
    }

    filtered.forEach(srv => {
        const card = document.createElement('div');
        card.className = 'bg-white p-7 rounded-[2rem] border border-gray-100 shadow-soft hover:shadow-floating transition-all flex flex-col justify-between group';
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-4">
                    <span class="bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest">${srv.category}</span>
                    <span class="flex items-center gap-1 text-sm font-black bg-yellow-50 px-2 py-0.5 rounded text-yellow-700">
                        <i class="fa-solid fa-star text-yellow-500"></i> ${srv.rating}
                    </span>
                </div>
                <h4 class="font-extrabold text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">${srv.title}</h4>
                <p class="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">${srv.desc}</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 flex items-center gap-1.5">
                    <i class="fa-solid fa-location-dot text-emerald-600"></i> ${srv.districts.join(', ')}
                </p>
            </div>
            <div class="mt-8 flex items-center justify-between pt-5 border-t border-gray-50">
                <div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Tarifa Base</span>
                    <span class="font-black text-emerald-700 text-2xl">S/ ${srv.price}<span class="text-sm font-semibold text-gray-400">/h</span></span>
                </div>
                <button onclick="goToRequest('${srv.title}', '${srv.category}', ${srv.price}, '${selDistrict}')" 
                    class="bg-gray-900 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5">
                    Cotizar
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

function submitRequest(e) {
    e.preventDefault();

    const formArea = document.getElementById('request-form-area');
    const loadingArea = document.getElementById('request-loading');

    appState.service.date = document.getElementById('req-date')?.value || 'Próximo fin de semana';
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
        let reply = "Entendido, estoy coordinando los detalles con el especialista para asegurar el cumplimiento de los protocolos UPC.";
        const lower = text.toLowerCase();
        if (lower.includes('seguridad') || lower.includes('verificado')) {
            reply = "Todos los especialistas cuentan con antecedentes penales y policiales verificados al 100% por el conserje VÉRTICE.";
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
        row.className = 'hover:bg-gray-50 transition border-b border-gray-100';
        row.innerHTML = `
            <td class="p-5 font-mono text-gray-500 font-bold">${req.id}</td>
            <td class="p-5 font-semibold text-gray-900">${req.code}</td>
            <td class="p-5">${req.service}</td>
            <td class="p-5">
                <span class="${req.statusClass} px-3 py-1 rounded text-xs font-bold inline-block">${req.status}</span>
            </td>
            <td class="p-5 text-right space-x-2">
                <button onclick="navigate('view-chat')" class="text-emerald-600 hover:text-emerald-800 text-xs font-bold underline">
                    Ver chat
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

    // Renderizar catálogo inicial
    renderCatalog();
});
