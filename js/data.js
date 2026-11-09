/**
 * VÉRTICE - Base de Datos Mock y Constantes de Configuración
 */

const APP_CONFIG = {
    appName: 'VÉRTICE',
    institution: 'UPC',
    defaultDeposit: 15.00,
    corporatePhone: '999 123 456',
    companyName: 'Vértice Servicios S.A.C.'
};

const DB_SERVICES = [
    // 1. Cursos y Tutorías
    { 
        id: 1, 
        title: 'Tutoría en Cálculo y Matemáticas', 
        category: 'Cursos y Tutorías', 
        districts: ['San Miguel', 'Surco', 'San Isidro'], 
        price: 35, 
        rating: 4.9, 
        reviews: 42, 
        desc: 'Preparación para PCs y exámenes de Cálculo I, II, Álgebra Lineal y Matemática Básica con ejercicios resueltos paso a paso.' 
    },
    { 
        id: 2, 
        title: 'Asesoría en Estadística y Minitab', 
        category: 'Cursos y Tutorías', 
        districts: ['San Isidro', 'Surco', 'San Miguel'], 
        price: 40, 
        rating: 4.9, 
        reviews: 35, 
        desc: 'Estadística Aplicada I y II, probabilidades, pruebas de hipótesis y procesamiento de datos en Minitab, SPSS y Excel.' 
    },
    { 
        id: 3, 
        title: 'Refuerzo en Finanzas y Contabilidad', 
        category: 'Cursos y Tutorías', 
        districts: ['San Isidro', 'Surco'], 
        price: 45, 
        rating: 4.8, 
        reviews: 28, 
        desc: 'Contabilidad Financiera, Costos, Evaluación de Proyectos y Finanzas Corporativas para carreras de Negocios y Economía.' 
    },
    { 
        id: 4, 
        title: 'Clases de Inglés Universitario', 
        category: 'Cursos y Tutorías', 
        districts: ['San Miguel', 'San Isidro', 'Todos'], 
        price: 35, 
        rating: 4.9, 
        reviews: 31, 
        desc: 'Preparación intensiva para el examen de suficiencia de inglés UPC, TOEFL, IELTS y conversación aplicada.' 
    },

    // 2. Tareas y Entregables
    { 
        id: 5, 
        title: 'Apoyo en Tareas y Guías Prácticas', 
        category: 'Tareas y Entregables', 
        districts: ['San Miguel', 'Surco', 'San Isidro'], 
        price: 30, 
        rating: 4.9, 
        reviews: 53, 
        desc: 'Orientación personalizada para resolver guías de ejercicios, talleres semanales y reportes de laboratorio según rúbrica.' 
    },
    { 
        id: 6, 
        title: 'Preparación de Diapositivas y Exposiciones', 
        category: 'Tareas y Entregables', 
        districts: ['Surco', 'San Miguel', 'Todos'], 
        price: 35, 
        rating: 4.8, 
        reviews: 26, 
        desc: 'Diseño de presentaciones PPT/Canva de alto impacto visual, estructura del pitch y simulacro de preguntas del jurado.' 
    },
    { 
        id: 7, 
        title: 'Revisión de Avances y Trabajos de Ciclo', 
        category: 'Tareas y Entregables', 
        districts: ['San Isidro', 'Surco', 'San Miguel'], 
        price: 40, 
        rating: 5.0, 
        reviews: 39, 
        desc: 'Auditoría integral de estructura, coherencia, redacción y cumplimiento de rúbricas antes de subir tu entrega al Aula Virtual.' 
    },

    // 3. Tesis y Redacción
    { 
        id: 8, 
        title: 'Asesor Metodológico de Tesis', 
        category: 'Tesis y Redacción', 
        districts: ['San Isidro', 'Surco', 'Todos'], 
        price: 55, 
        rating: 5.0, 
        reviews: 48, 
        desc: 'Estructuración del proyecto de tesis, planteamiento del problema, marco teórico y diseño metodológico según formato UPC.' 
    },
    { 
        id: 9, 
        title: 'Normas APA / Vancouver y Turnitin', 
        category: 'Tesis y Redacción', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 35, 
        rating: 4.9, 
        reviews: 64, 
        desc: 'Control de porcentaje de similitud en Turnitin, corrección de citaciones, referencias bibliográficas y formato de tablas.' 
    },
    { 
        id: 10, 
        title: 'Redacción y Corrección de Ensayos', 
        category: 'Tesis y Redacción', 
        districts: ['San Isidro', 'San Miguel', 'Surco'], 
        price: 40, 
        rating: 4.8, 
        reviews: 33, 
        desc: 'Corrección ortotipográfica, fluidez académica, cohesión argumentativa y estilo para ensayos y artículos científicos.' 
    },

    // 4. Software y Diseño
    { 
        id: 11, 
        title: 'Tutoría en Programación (Python / Java / C++)', 
        category: 'Software y Diseño', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 45, 
        rating: 5.0, 
        reviews: 58, 
        desc: 'Fundamentos de código, algoritmos, programación orientada a objetos, estructuras de datos y debugging de proyectos.' 
    },
    { 
        id: 12, 
        title: 'Desarrollo Web y Bases de Datos SQL', 
        category: 'Software y Diseño', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 50, 
        rating: 4.9, 
        reviews: 37, 
        desc: 'Asesoría en desarrollo frontend (HTML/CSS/JS/React), backend, diagramas entidad-relación y consultas complejas en SQL.' 
    },
    { 
        id: 13, 
        title: 'Diseño Gráfico y Edición Multimedia', 
        category: 'Software y Diseño', 
        districts: ['San Miguel', 'Surco', 'San Isidro'], 
        price: 40, 
        rating: 4.9, 
        reviews: 29, 
        desc: 'Creación de infografías académicas, maquetación de piezas visuales y edición rápida de video/reels para entregas de cursos.' 
    },
    { 
        id: 14, 
        title: 'Consultoría en Herramientas de IA para Estudio', 
        category: 'Software y Diseño', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 40, 
        rating: 5.0, 
        reviews: 44, 
        desc: 'Uso ético y productivo de IA (ChatGPT, Claude, Perplexity) para estructurar investigación, generar resúmenes y estudiar mejor.' 
    }
];

const DB_ADMIN_REQUESTS = [
    {
        id: 'S-001',
        code: 'u202219491',
        service: 'Tutoría Cálculo II',
        status: 'Confirmado',
        statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        date: '08/11/2026',
        district: 'San Miguel'
    },
    {
        id: 'S-002',
        code: 'u20211g5058',
        service: 'Asesor Metodológico Tesis',
        status: 'En matching',
        statusClass: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
        date: '09/11/2026',
        district: 'Surco'
    },
    {
        id: 'S-003',
        code: 'u202523271',
        service: 'Revisión Turnitin y APA',
        status: 'Nuevo (Esperando)',
        statusClass: 'bg-blue-50 text-blue-700 border border-blue-100',
        date: '09/11/2026',
        district: 'San Isidro'
    }
];
