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
    { 
        id: 1, 
        title: 'Chofer de Seguridad', 
        category: 'Seguridad', 
        districts: ['San Isidro', 'Surco'], 
        price: 45, 
        rating: 4.9, 
        reviews: 31, 
        desc: 'Traslados seguros con conductor verificado. Vehículo discreto y revisión técnica al día.' 
    },
    { 
        id: 2, 
        title: 'Acompañamiento Ejecutivo', 
        category: 'Social/Asistencia', 
        districts: ['San Isidro', 'Surco'], 
        price: 50, 
        rating: 4.8, 
        reviews: 17, 
        desc: 'Escolta discreto y protocolar para reuniones y eventos nocturnos de alta exigencia.' 
    },
    { 
        id: 3, 
        title: 'Custodia Temporal', 
        category: 'Seguridad', 
        districts: ['San Miguel', 'Surco'], 
        price: 40, 
        rating: 4.9, 
        reviews: 23, 
        desc: 'Resguardo de personas o pertenencias de valor en traslados o estancias por horas establecidas.' 
    },
    { 
        id: 4, 
        title: 'Facilitador de Eventos', 
        category: 'Social/Asistencia', 
        districts: ['San Miguel', 'San Isidro', 'Surco'], 
        price: 35, 
        rating: 4.7, 
        reviews: 12, 
        desc: 'Soporte logístico, coordinación de accesos y acompañamiento dinámico a medida.' 
    },
    { 
        id: 5, 
        title: 'Tutor Universitario Avanzado', 
        category: 'Clases', 
        districts: ['San Isidro', 'San Miguel', 'Surco'], 
        price: 60, 
        rating: 5.0, 
        reviews: 45, 
        desc: 'Reforzamiento académico especializado en finanzas, ingeniería y ciencias aplicadas UPC.' 
    },
    { 
        id: 6, 
        title: 'Asesor Metodológico Tesis', 
        category: 'Clases', 
        districts: ['San Isidro', 'Todos'], 
        price: 75, 
        rating: 4.9, 
        reviews: 28, 
        desc: 'Revisión exhaustiva, control de citación APA y orientación metodológica para trabajos finales.' 
    },
    { 
        id: 7, 
        title: 'Diseño Gráfico & Edición de Video', 
        category: 'Servicios Profesionales', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 50, 
        rating: 4.9, 
        reviews: 19, 
        desc: 'Creación de piezas visuales, branding para proyectos y edición ágil de video/reels académicos.' 
    },
    { 
        id: 8, 
        title: 'Redacción & Corrección de Estilo', 
        category: 'Servicios Profesionales', 
        districts: ['San Isidro', 'Surco', 'San Miguel'], 
        price: 45, 
        rating: 4.8, 
        reviews: 24, 
        desc: 'Revisión de sintaxis, normas APA/Vancouver y pulido de redacción para ensayos y papers UPC.' 
    },
    { 
        id: 9, 
        title: 'Programación & Desarrollo Web', 
        category: 'Servicios Profesionales', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 60, 
        rating: 5.0, 
        reviews: 38, 
        desc: 'Tutoría en código (Python, JS, C++), desarrollo frontend/backend y debugging de software.' 
    },
    { 
        id: 10, 
        title: 'Idiomas & Traducción Académica', 
        category: 'Clases', 
        districts: ['San Isidro', 'San Miguel', 'Todos'], 
        price: 50, 
        rating: 4.9, 
        reviews: 21, 
        desc: 'Asesoría en inglés universitario, preparación TOEFL/IELTS y traducción de literatura técnica.' 
    },
    { 
        id: 11, 
        title: 'Orientación Vocacional & Mentoría', 
        category: 'Social/Asistencia', 
        districts: ['Surco', 'San Miguel', 'San Isidro'], 
        price: 45, 
        rating: 4.8, 
        reviews: 15, 
        desc: 'Sesiones 1-a-1 de mentoría de carrera, optimización de CV/LinkedIn y preparación de entrevistas.' 
    },
    { 
        id: 12, 
        title: 'Fotografía Profesional', 
        category: 'Servicios Profesionales', 
        districts: ['San Isidro', 'San Miguel', 'Surco'], 
        price: 55, 
        rating: 4.9, 
        reviews: 18, 
        desc: 'Sesiones de fotos de perfil profesional para LinkedIn, eventos académicos y proyectos multimedia.' 
    },
    { 
        id: 13, 
        title: 'Consultoría en Inteligencia Artificial', 
        category: 'Clases', 
        districts: ['San Miguel', 'Surco', 'Todos'], 
        price: 55, 
        rating: 5.0, 
        reviews: 42, 
        desc: 'Dominio práctico de herramientas de IA generativa aplicadas a investigación y productividad ética.' 
    }
];

const DB_ADMIN_REQUESTS = [
    {
        id: 'S-001',
        code: 'u2012345',
        service: 'Chofer Seguridad',
        status: 'Confirmado',
        statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        date: '28/10/2026',
        district: 'San Isidro'
    },
    {
        id: 'S-002',
        code: 'u2098765',
        service: 'Asesor Tesis',
        status: 'En matching',
        statusClass: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
        date: '29/10/2026',
        district: 'San Miguel'
    },
    {
        id: 'S-003',
        code: 'u2045678',
        service: 'Acompañamiento',
        status: 'Nuevo (Esperando)',
        statusClass: 'bg-blue-50 text-blue-700 border border-blue-100',
        date: '29/10/2026',
        district: 'Surco'
    }
];
