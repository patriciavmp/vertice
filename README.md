# VÉRTICE — Red de Confianza UPC 🎓🛡️

[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20TailwindCSS%20%7C%20Vanilla%20JS-059669.svg)](#tecnolog%C3%ADas)
[![Status](https://img.shields.io/badge/Status-Prototipo%20Funcional%20Alta%20Fidelidad-emerald.svg)](#)
[![UPC Exclusive](https://img.shields.io/badge/Ecosistema-Exclusivo%20UPC-red.svg)](#)

Plataforma web de confianza y vinculación de servicios especializados (seguridad, acompañamiento y soporte académico) diseñada exclusivamente para la comunidad de la **Universidad Peruana de Ciencias Aplicadas (UPC)**.

---

## 🌟 Características Principales

1. **Acceso Institucional Protegido:**
   - Validación en tiempo real de código de alumno/docente (`u20XXXXXX`).
   - Acceso exclusivo al catálogo protegido.

2. **Catálogo de Servicios y Filtros Reactivos:**
   - Filtro multicategoría (Seguridad / Resguardo, Social / Asistencia, Clases Especializadas).
   - Filtro por distritos de Lima Metropolitana (San Isidro, Miraflores, Surco, San Borja, etc.).
   - Rango dinámico de tarifas por hora con actualización instantánea.

3. **Flujo de Solicitud y Curaduría Humana:**
   - Formulario de requerimiento paso a paso con barra de progreso.
   - Animación de matching y verificación por el equipo de conserjería.

4. **Ficha de Especialista con Identidad Protegida:**
   - Perfil con identidad reservada hasta la confirmación de la reserva.
   - Calificación comunitaria, insignias de verificación de antecedentes penales y tarifa base.

5. **Simulador Interactivo de WhatsApp con el Conserje:**
   - Interfaz réplica de WhatsApp web interactiva.
   - Envío y recepción de mensajes en tiempo real con respuestas inteligentes del bot conserje.
   - Tarjeta interactiva de pago de seña incrustada en el chat.

6. **Pasarela de Seña (Yape & Plin):**
   - Selector dinámico de billeteras digitales (código QR interactivo, número corporativo y razón social).
   - Carga y validación de comprobante (voucher) de pago.

7. **Constancia Digital de Reserva y Descarga en PDF:**
   - Comprobante digital oficial con marca de agua de seguridad institucional.
   - Desbloqueo de datos reales de contacto y fotografía del especialista.
   - Generación y descarga directa en PDF de alta fidelidad vía `html2pdf.js`.

8. **Panel Interno del Conserje (Admin):**
   - Métricas y KPIs operativos en tiempo real (Tiempo de respuesta, tasa de conversión, filtro UPC, CSAT).
   - Tabla interactiva de solicitudes con estados y acceso directo a chats.

9. **Navegador Rápido de Prototipo (Dev Menu):**
   - Selector flotante para saltar directamente entre cualquiera de las 9 pantallas del flujo.

---

## 📁 Estructura del Proyecto

El proyecto está organizado siguiendo principios de arquitectura limpia, modular y desacoplada:

```plaintext
vertice/
│
├── index.html               # Página de entrada principal (SPA semántica y accesible)
│
├── css/
│   └── styles.css           # Estilos personalizados, keyframes, scrollbars, glassmorphism y toasts
│
├── js/
│   ├── data.js              # Base de datos mock (servicios, solicitudes admin y configuración)
│   └── app.js               # Enrutador SPA, lógica de negocio, filtros, chat y exportación PDF
│
├── .gitignore               # Exclusiones estándar de Git
└── README.md                # Documentación técnica del proyecto
```

---

## 🚀 Cómo Ejecutar Localmente

Dado que este proyecto está construido con **HTML5 puro, CSS (Tailwind) y JavaScript moderno**, no requiere compilación ni dependencias de Node.js:

### Opción 1: Abrir directamente en el navegador
Haga doble clic en el archivo `index.html` o ábralo con su navegador favorito (Chrome, Edge, Firefox, Brave, Safari).

### Opción 2: Con Python (Recomendado para testing de PDF y CORS)
```bash
# En la raíz del proyecto
python -m http.server 8080
```
Luego visite: [http://localhost:8080](http://localhost:8080)

### Opción 3: Con VS Code Live Server
1. Abra la carpeta `vertice` en Visual Studio Code.
2. Haga clic derecho sobre `index.html`.
3. Seleccione **"Open with Live Server"**.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica, accesibilidad y layouts modernos.
- **Tailwind CSS (CDN):** Sistema de diseño utilitario, responsivo y paleta corporativa esmeralda.
- **Vanilla JavaScript (ES6+):** Enrutamiento SPA sin recarga de página, filtros dinámicos y manejo de estado.
- **FontAwesome 6:** Iconografía vectorial.
- **Google Fonts (Inter):** Tipografía moderna de alta legibilidad.
- **html2pdf.js:** Motor de renderizado en cliente para exportación de constancias a PDF.

---

## 👤 Autor y Repositorio

- **Usuario:** [@patriciavmp](https://github.com/patriciavmp)
- **Repositorio:** [https://github.com/patriciavmp/vertice.git](https://github.com/patriciavmp/vertice.git)
- **Proyecto:** VÉRTICE UPC — Prototipo Funcional de Alta Fidelidad
