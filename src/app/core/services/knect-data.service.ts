import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import {
  Business,
  EstablishmentBranch,
  EstablishmentType,
  PaginatedResponse,
  Review,
  BlogPost,
  HomeCms,
  ContactMessage,
  BusinessAnalytics,
  GlobalAnalytics,
  User,
} from '../../shared/models';

const FALLBACK_CATEGORIES: EstablishmentType[] = [
  {
    establishmentTypeId: 1,
    name: 'Restaurante',
    nameEn: 'Restaurant',
    icon: 'utensils',
    description: 'Gastronomía, cocina de autor, gastrobares y cocinas ocultas en Manizales',
  },
  {
    establishmentTypeId: 2,
    name: 'Café & Panadería',
    nameEn: 'Coffee & Bakery',
    icon: 'coffee',
    description: 'Cafés de especialidad del Paisaje Cultural Cafetero y pastelerías tradicionales',
  },
  {
    establishmentTypeId: 3,
    name: 'Tienda & Comercio',
    nameEn: 'Retail & Store',
    icon: 'shopping-bag',
    description: 'Tiendas de moda, centros comerciales, diseño y comercio local en Manizales',
  },
  {
    establishmentTypeId: 4,
    name: 'Servicios',
    nameEn: 'Services',
    icon: 'briefcase',
    description: 'Coworking, tecnología, gimnasios, salud y bienestar en Manizales',
  },
];

const FALLBACK_BUSINESSES: Business[] = [
  {
    id: 1,
    businessId: 1,
    ownerUserId: 2,
    ownerName: 'Carlos Restrepo',
    ownerEmail: 'marca@knect.com',
    establishmentTypeId: 1,
    category: 'Restaurante',
    categoryEn: 'Restaurant',
    name: 'Anatilde Cocina de Autor & Gastrobar',
    legalName: 'Anatilde Gastronomía Caldense S.A.S.',
    taxNumber: '901.452.881-3',
    description:
      'Cocina colombiana de autor en Manizales que reinterpreta platos tradicionales de la cordillera central con técnicas contemporáneas. Sedes en el sector de El Cable y el bulevar gastronómico de Milán (Zona G).',
    descriptionEn:
      'Signature Colombian cuisine in Manizales reinterpreting traditional recipes from the Central Andes with contemporary techniques. Locations in El Cable and Milán Gourmet District.',
    primaryColor: '#D97706',
    logoUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
    neighborhood: 'El Cable',
    address: 'Calle 66 # 23-31, Sector El Cable, Manizales',
    phone: '+57 310 444 5566',
    whatsapp: '573104445566',
    email: 'reservas@anatildemanizales.co',
    website: 'https://anatildemanizales.co',
    isGhostKitchen: false,
    hasDineIn: true,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 2,
    viewCount: 412,
    searchAppearanceCount: 620,
    whatsappClickCount: 154,
    establishments: [
      {
        id: 1,
        establishmentId: 1,
        businessId: 1,
        name: 'Sede Principal El Cable',
        description:
          'Salón principal y terraza frente al corredor universitario y empresarial de El Cable.',
        schedules: 'Mar - Sáb: 12:00 PM - 10:00 PM | Dom: 12:00 PM - 4:00 PM',
        neighborhood: 'El Cable',
        address: 'Calle 66 # 23-31, Sector El Cable, Manizales',
        latitude: 5.0558,
        longitude: -75.4855,
        phone: '+57 310 444 5566',
        whatsapp: '573104445566',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 82,
      },
      {
        id: 2,
        establishmentId: 2,
        businessId: 1,
        name: 'Sede Bulevar Milán (Zona G)',
        description:
          'Ambiente gastrobar y coctelería de autor en la Zona G de Milán con vista a la montaña.',
        schedules: 'Mar - Dom: 12:00 PM - 11:00 PM',
        neighborhood: 'Milán',
        address: 'Calle 75 # 23-45, Bulevar de Milán, Manizales',
        latitude: 5.0459,
        longitude: -75.4799,
        phone: '+57 310 444 5567',
        whatsapp: '573104445567',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 48,
      },
      {
        id: 3,
        establishmentId: 3,
        businessId: 1,
        name: 'Sede Avenida Santander (Palermo)',
        description:
          'Punto gastronómico sobre la Av. Santander con parqueadero privado y salón de eventos.',
        schedules: 'Lun - Dom: 12:00 PM - 10:00 PM',
        neighborhood: 'Palermo',
        address: 'Avenida Santander # 75-75, Sector Palermo, Manizales',
        latitude: 5.0488,
        longitude: -75.4878,
        phone: '+57 310 444 5568',
        whatsapp: '573104445568',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 24,
      },
    ],
  },
  {
    id: 2,
    businessId: 2,
    ownerUserId: 3,
    ownerName: 'Valentina Ospina',
    ownerEmail: 'darkkitchen@knect.com',
    establishmentTypeId: 1,
    category: 'Restaurante',
    categoryEn: 'Restaurant',
    name: 'Buffalo Republic Smash Lab',
    legalName: 'Buffalo Smash Cloud Kitchens Manizales S.A.S.',
    taxNumber: '901.789.321-0',
    description:
      'Hamburguesas artesanales tipo Smash Burger en pan brioche de papa criolla caldense y costillas ahumadas. Operamos bajo modalidad de Cocina Oculta (Dark Kitchen) en Manizales para entregas ultra rápidas por WhatsApp.',
    descriptionEn:
      'Artisanal Smash Burgers on Caldas potato brioche buns and smoked ribs. Operating as a Dark Kitchen in Manizales for ultra-fast WhatsApp delivery.',
    primaryColor: '#E11D48',
    logoUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80',
    neighborhood: 'Palermo',
    address: 'Calle 69 # 24-36, Barrio Palermo, Manizales',
    phone: '+57 315 777 8899',
    whatsapp: '573157778899',
    email: 'pedidos@buffalosmashmanizales.co',
    website: 'https://buffalosmashmanizales.co',
    isGhostKitchen: true,
    hasDineIn: false,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 1,
    viewCount: 318,
    searchAppearanceCount: 490,
    whatsappClickCount: 192,
    establishments: [
      {
        id: 4,
        establishmentId: 4,
        businessId: 2,
        name: 'Hub Cocina Oculta Palermo / El Cable (Oriente)',
        description:
          'Centro de despacho exclusivo para domicilios en El Cable, Milán, Palermo, Sancancio y La Estrella.',
        schedules: 'Todos los días: 11:30 AM - 11:30 PM',
        neighborhood: 'Palermo',
        address: 'Calle 69 # 24-36, Barrio Palermo, Manizales',
        latitude: 5.0475,
        longitude: -75.491,
        phone: '+57 315 777 8899',
        whatsapp: '573157778899',
        isGhostKitchen: true,
        hasDineIn: false,
        isActive: true,
        whatsappClicks: 122,
      },
      {
        id: 5,
        establishmentId: 5,
        businessId: 2,
        name: 'Hub Cocina Oculta Chipre / Centro (Occidente)',
        description:
          'Despacho rápido para Chipre, Francia, Los Alcázares, Centro y Fundadores.',
        schedules: 'Todos los días: 12:00 PM - 11:00 PM',
        neighborhood: 'Chipre',
        address: 'Carrera 9C # 8-42, Sector Mirador de Chipre, Manizales',
        latitude: 5.0758,
        longitude: -75.5254,
        phone: '+57 315 777 8890',
        whatsapp: '573157778890',
        isGhostKitchen: true,
        hasDineIn: false,
        isActive: true,
        whatsappClicks: 70,
      },
    ],
  },
  {
    id: 3,
    businessId: 3,
    ownerUserId: 2,
    ownerName: 'Carlos Restrepo',
    ownerEmail: 'marca@knect.com',
    establishmentTypeId: 2,
    category: 'Café & Panadería',
    categoryEn: 'Coffee & Bakery',
    name: 'Pastelería La Suiza & Café de Origen',
    legalName: 'Pastelería La Suiza Manizales S.A.S.',
    taxNumber: '890.801.634-9',
    description:
      'Tradición pastelera y gastronómica de Manizales desde 1951. Milhojas artesanales, panadería europea de masa madre y métodos de filtrado con cafés especiales premiados de Caldas en El Cable y el Centro.',
    descriptionEn:
      'Iconic bakery and coffee house in Manizales since 1951. Artisanal mille-feuille, European sourdough bakery, and award-winning Caldas specialty coffee in El Cable and Downtown.',
    primaryColor: '#059669',
    logoUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80',
    neighborhood: 'El Cable',
    address: 'Carrera 23B # 64-06, Sector El Cable, Manizales',
    phone: '+57 (606) 885 0545',
    whatsapp: '573116203344',
    email: 'contacto@lasuizamanizales.co',
    website: 'https://lasuiza.com.co',
    isGhostKitchen: false,
    hasDineIn: true,
    isFeatured: true,
    isActive: true,
    ratingAvg: 5.0,
    reviewCount: 1,
    viewCount: 380,
    searchAppearanceCount: 540,
    whatsappClickCount: 134,
    establishments: [
      {
        id: 6,
        establishmentId: 6,
        businessId: 3,
        name: 'Sede El Cable (Zona Universitaria)',
        description:
          'Sede icónica en la zona rosa de El Cable con terraza, repostería tradicional y barra de espresso.',
        schedules: 'Lun - Dom: 7:30 AM - 8:30 PM',
        neighborhood: 'El Cable',
        address: 'Carrera 23B # 64-06, Sector El Cable, Manizales',
        latitude: 5.0563,
        longitude: -75.4864,
        phone: '+57 (606) 885 0545',
        whatsapp: '573116203344',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 84,
      },
      {
        id: 7,
        establishmentId: 7,
        businessId: 3,
        name: 'Sede Centro Histórico (Carrera 23)',
        description:
          'Punto clásico en el corazón bancario y cultural del Centro Histórico de Manizales.',
        schedules: 'Lun - Sáb: 8:00 AM - 7:30 PM',
        neighborhood: 'Centro',
        address: 'Carrera 23 # 26-57, Centro Histórico, Manizales',
        latitude: 5.0689,
        longitude: -75.5174,
        phone: '+57 (606) 884 6331',
        whatsapp: '573116203345',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 50,
      },
    ],
  },
  {
    id: 4,
    businessId: 4,
    ownerUserId: 1,
    ownerName: 'Sergio Alzate Román',
    ownerEmail: 'admin@knect.com',
    establishmentTypeId: 2,
    category: 'Café & Panadería',
    categoryEn: 'Coffee & Bakery',
    name: 'Santo Kaffeto & Differente Roasters',
    legalName: 'Tostadores Especiales de Caldas S.A.S.',
    taxNumber: '900.912.408-1',
    description:
      'Laboratorio de barismo y café de especialidad cultivado en las montañas de Caldas. Espacios con WiFi de alta velocidad para trabajo remoto en La Estrella, Avenida Santander y C.C. Cable Plaza.',
    descriptionEn:
      'Barista lab and specialty coffee grown in the mountains of Caldas. High-speed WiFi workspaces in La Estrella, Avenida Santander, and Cable Plaza Mall.',
    primaryColor: '#0D9488',
    logoUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=80',
    neighborhood: 'La Estrella',
    address: 'Calle 60 # 24A-36, Sector La Estrella, Manizales',
    phone: '+57 312 850 4411',
    whatsapp: '573128504411',
    email: 'barismo@santokaffeto.com',
    website: 'https://santokaffeto.com',
    isGhostKitchen: false,
    hasDineIn: true,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 0,
    viewCount: 265,
    searchAppearanceCount: 390,
    whatsappClickCount: 98,
    establishments: [
      {
        id: 8,
        establishmentId: 8,
        businessId: 4,
        name: 'Sede La Estrella / Av. Santander',
        description:
          'Casa cafetera especializada en microlotes, métodos V60/Chemex y escuela de barismo.',
        schedules: 'Lun - Sáb: 8:00 AM - 8:00 PM',
        neighborhood: 'La Estrella',
        address: 'Calle 60 # 24A-36, Sector La Estrella, Manizales',
        latitude: 5.0598,
        longitude: -75.4925,
        phone: '+57 312 850 4411',
        whatsapp: '573128504411',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 58,
      },
      {
        id: 9,
        establishmentId: 9,
        businessId: 4,
        name: 'Barra de Experiencia C.C. Cable Plaza',
        description:
          'Punto de degustación y venta de café en grano dentro del Centro Comercial Cable Plaza.',
        schedules: 'Lun - Dom: 10:00 AM - 8:30 PM',
        neighborhood: 'El Cable',
        address: 'Carrera 23 # 65-11, C.C. Cable Plaza Local 108, Manizales',
        latitude: 5.0566,
        longitude: -75.4868,
        phone: '+57 312 850 4412',
        whatsapp: '573128504412',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 40,
      },
    ],
  },
  {
    id: 5,
    businessId: 5,
    ownerUserId: 1,
    ownerName: 'Sergio Alzate Román',
    ownerEmail: 'admin@knect.com',
    establishmentTypeId: 3,
    category: 'Tienda & Comercio',
    categoryEn: 'Retail & Store',
    name: 'Sancancio & Cable Plaza Moda Local',
    legalName: 'Vitrina Comercial de Caldas S.A.S.',
    taxNumber: '901.119.402-5',
    description:
      'Tienda multimarca de moda, marroquinería en cuero, calzado y diseño local ubicada en los centros comerciales Sancancio y Cable Plaza de Manizales. Asesoría y envíos urbanos por WhatsApp.',
    descriptionEn:
      'Multi-brand fashion, leather goods, footwear, and local design concept store located in Sancancio and Cable Plaza malls in Manizales. Personal styling and delivery via WhatsApp.',
    primaryColor: '#0284C7',
    logoUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
    neighborhood: 'Sancancio',
    address: 'Carrera 27A # 66-30, C.C. Sancancio, Manizales',
    phone: '+57 318 900 1122',
    whatsapp: '573189001122',
    email: 'tiendas@sancanciomoda.co',
    website: 'https://sancancio.com',
    isGhostKitchen: false,
    hasDineIn: true,
    isFeatured: true,
    isActive: true,
    ratingAvg: 4.8,
    reviewCount: 0,
    viewCount: 210,
    searchAppearanceCount: 305,
    whatsappClickCount: 74,
    establishments: [
      {
        id: 10,
        establishmentId: 10,
        businessId: 5,
        name: 'Boutique Centro Comercial Sancancio',
        description:
          'Showroom principal de moda, calzado y accesorios con parqueadero en el C.C. Sancancio.',
        schedules: 'Lun - Sáb: 10:00 AM - 8:00 PM | Dom: 11:00 AM - 6:00 PM',
        neighborhood: 'Sancancio',
        address: 'Carrera 27A # 66-30, C.C. Sancancio Local 212, Manizales',
        latitude: 5.0477,
        longitude: -75.4923,
        phone: '+57 318 900 1122',
        whatsapp: '573189001122',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 46,
      },
      {
        id: 11,
        establishmentId: 11,
        businessId: 5,
        name: 'Tienda Centro Comercial Cable Plaza',
        description:
          'Punto de venta y recolección rápida en el corazón comercial de El Cable.',
        schedules: 'Lun - Sáb: 10:00 AM - 8:30 PM | Dom: 10:00 AM - 7:00 PM',
        neighborhood: 'El Cable',
        address: 'Carrera 23 # 65-11, C.C. Cable Plaza Piso 2, Manizales',
        latitude: 5.0564,
        longitude: -75.4862,
        phone: '+57 318 900 1123',
        whatsapp: '573189001123',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 28,
      },
    ],
  },
  {
    id: 6,
    businessId: 6,
    ownerUserId: 1,
    ownerName: 'Sergio Alzate Román',
    ownerEmail: 'admin@knect.com',
    establishmentTypeId: 4,
    category: 'Servicios',
    categoryEn: 'Services',
    name: 'Thinka Coworking & Wellness Hub',
    legalName: 'Thinka Espacios & Bienestar Manizales S.A.S.',
    taxNumber: '901.550.901-8',
    description:
      'Espacios corporativos flexibles, oficinas privadas en el Centro de Negocios Siglo XXI (El Cable), salas de capacitación en Palermo y convenio de acondicionamiento físico en Sancancio.',
    descriptionEn:
      'Flexible corporate workspaces, private offices at Siglo XXI Business Center (El Cable), training rooms in Palermo, and fitness wellness center in Sancancio.',
    primaryColor: '#7C3AED',
    logoUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    bannerUrl:
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1400&q=80',
    neighborhood: 'El Cable',
    address: 'Carrera 23C # 62-06, Edificio Siglo XXI, El Cable, Manizales',
    phone: '+57 321 700 4545',
    whatsapp: '573217004545',
    email: 'comunidad@thinka.com.co',
    website: 'https://thinka.com.co',
    isGhostKitchen: false,
    hasDineIn: true,
    isFeatured: false,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 0,
    viewCount: 178,
    searchAppearanceCount: 260,
    whatsappClickCount: 81,
    establishments: [
      {
        id: 12,
        establishmentId: 12,
        businessId: 6,
        name: 'Sede Thinka Edificio Siglo XXI (El Cable)',
        description:
          'Piso corporativo con oficinas privadas, cabinas de videollamadas y terraza mirador.',
        schedules: 'Lun - Vie: 7:00 AM - 8:00 PM | Sáb: 8:00 AM - 2:00 PM',
        neighborhood: 'El Cable',
        address: 'Carrera 23C # 62-06, Centro de Negocios Siglo XXI, Manizales',
        latitude: 5.0574,
        longitude: -75.4881,
        phone: '+57 321 700 4545',
        whatsapp: '573217004545',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 52,
      },
      {
        id: 13,
        establishmentId: 13,
        businessId: 6,
        name: 'Sede Wellness & Fitness C.C. Sancancio',
        description:
          'Centro de acondicionamiento físico, zonas húmedas y coworking deportivo en Sancancio.',
        schedules: 'Lun - Vie: 5:00 AM - 10:00 PM | Sáb - Dom: 7:00 AM - 4:00 PM',
        neighborhood: 'Sancancio',
        address: 'Carrera 27A # 66-30, Interior C.C. Sancancio, Manizales',
        latitude: 5.0479,
        longitude: -75.492,
        phone: '+57 321 700 4546',
        whatsapp: '573217004546',
        isGhostKitchen: false,
        hasDineIn: true,
        isActive: true,
        whatsappClicks: 29,
      },
    ],
  },
];

const FALLBACK_REVIEWS: Review[] = [
  {
    id: 1,
    reviewId: 1,
    businessId: 1,
    businessName: 'Anatilde Cocina de Autor & Gastrobar',
    establishmentId: 1,
    establishmentName: 'Sede Principal El Cable',
    userId: 4,
    userName: 'María Camila Gómez',
    rating: 5,
    comment:
      '¡Espectacular experiencia en la sede de El Cable en Manizales! Los platos de autor con ingredientes caldenses estuvieron increíbles y reservamos mesa directo por WhatsApp en menos de dos minutos.',
    adminReply:
      '¡Muchas gracias por visitarnos en El Cable, María Camila! Nos alegra enormemente saber que disfrutaste nuestra propuesta gastronómica en Manizales. ¡Te esperamos pronto!',
    adminReplyAt: '2026-10-25T14:30:00',
    createAt: '2026-10-24T19:15:00',
  },
  {
    id: 2,
    reviewId: 2,
    businessId: 1,
    businessName: 'Anatilde Cocina de Autor & Gastrobar',
    establishmentId: 2,
    establishmentName: 'Sede Bulevar Milán (Zona G)',
    userId: 3,
    userName: 'Valentina Ospina',
    rating: 5,
    comment:
      'El ambiente nocturno en la sede del Bulevar de Milán (Zona G) es inigualable. Muy recomendados los cócteles de café y uchuva.',
    createAt: '2026-10-25T20:10:00',
  },
  {
    id: 3,
    reviewId: 3,
    businessId: 2,
    businessName: 'Buffalo Republic Smash Lab',
    userId: 4,
    userName: 'María Camila Gómez',
    rating: 5,
    comment:
      'Pedí por el botón de WhatsApp desde el Hub de Palermo y llegó a mi apartamento en El Cable en 20 minutos súper caliente. La mejor Smash Burger de Manizales.',
    adminReply:
      '¡Gracias por tus 5 estrellas! Nuestro equipo de Cocina Oculta en Palermo y Chipre trabaja al segundo para cubrir toda Manizales.',
    adminReplyAt: '2026-10-26T10:00:00',
    createAt: '2026-10-25T21:00:00',
  },
  {
    id: 4,
    reviewId: 4,
    businessId: 3,
    businessName: 'Pastelería La Suiza & Café de Origen',
    userId: 4,
    userName: 'María Camila Gómez',
    rating: 5,
    comment:
      'La milhoja de La Suiza en El Cable acompañada de un café filtrado de origen caldense es una parada obligatoria en Manizales.',
    createAt: '2026-10-26T09:15:00',
  },
];

const FALLBACK_POSTS: BlogPost[] = [
  {
    postId: 1,
    id: 1,
    title:
      'Knect impulsa la transformación digital de más de 150 comercios locales en Manizales',
    titleEn:
      'Knect drives digital transformation for over 150 local businesses in Manizales',
    slug: 'knect-impulsa-transformacion-digital-comercios-manizales',
    summary:
      'Conoce cómo los establecimientos de El Cable, Milán, Palermo, Sancancio y el Centro Histórico están multiplicando sus ventas directas vía WhatsApp y mapas interactivos.',
    summaryEn:
      'Learn how establishments in El Cable, Milán, Palermo, Sancancio, and Downtown Manizales are multiplying their direct sales via WhatsApp and interactive maps.',
    content:
      'La digitalización del comercio local en Manizales se ha convertido en el motor principal del crecimiento empresarial en Caldas. A través de Knect, los establecimientos de sectores emblemáticos como El Cable, la Zona G de Milán, Palermo, Sancancio y Chipre cuentan ahora con una vitrina personalizada que respeta los colores e identidad de su marca.\n\nGracias a la georreferenciación de múltiples sedes y el botón de contacto directo a WhatsApp sin intermediarios ni comisiones ocultas, los manizaleños y visitantes pueden identificar en segundos la sucursal más cercana, verificar si un restaurante cuenta con atención en mesa o funciona como Cocina Oculta (Dark Kitchen), y realizar su pedido o reserva al instante.',
    contentEn:
      'Digitalization of local commerce in Manizales has become the primary engine of business growth in Caldas. Through Knect, establishments across iconic districts like El Cable, Milán Gourmet Zone, Palermo, Sancancio, and Chipre enjoy a customized storefront that showcases their brand identity.\n\nWith multi-branch interactive mapping and commission-free direct WhatsApp messaging, locals and visitors can locate the nearest branch in seconds, check whether a restaurant offers dine-in service or operates as a Dark Kitchen, and place their order or reservation immediately.',
    imageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Equipo Editorial Knect Manizales',
    publishedAt: '2026-10-22T10:00:00',
    isActive: true,
  },
  {
    postId: 2,
    id: 2,
    title:
      'Tendencia Gastronómica en Manizales: Cocinas Ocultas en Palermo vs. Experiencia en Mesa en Milán',
    titleEn:
      'Dining Trends in Manizales: Dark Kitchens in Palermo vs. Dine-In Experience in Milán',
    slug: 'tendencia-gastronomica-manizales-cocinas-ocultas-vs-milan',
    summary:
      'Descubre por qué la claridad en la modalidad operativa de los restaurantes mejora la experiencia de los comensales en la capital de Caldas.',
    summaryEn:
      'Discover why transparency in restaurant operating modes improves the dining experience across the capital of Caldas.',
    content:
      'Uno de los mayores retos para los amantes de la gastronomía en Manizales es saber con certeza si una marca gastronómica cuenta con salón físico para atención al público (como los gastrobares del Bulevar de Milán o El Cable) o si opera como un laboratorio culinario exclusivo para domicilios (Cocina Oculta / Dark Kitchen).\n\nEn Knect hemos incorporado distintivos claros en cada ficha comercial para que antes de desplazarte por la Avenida Santander o pedir por WhatsApp sepas exactamente qué modalidad ofrece cada sede.',
    contentEn:
      'One of the biggest challenges for food lovers in Manizales is knowing for sure whether a culinary brand has a physical dining room (like the gastrobars in Milán or El Cable) or operates exclusively as a delivery-only Dark Kitchen.\n\nAt Knect, we have built clear operational badges into every restaurant profile so you know before heading down Avenida Santander or messaging on WhatsApp exactly how each branch operates.',
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Sergio Alzate Román',
    publishedAt: '2026-10-24T15:30:00',
    isActive: true,
  },
  {
    postId: 3,
    id: 3,
    title:
      'Ruta del Café de Especialidad y Pastelería en El Cable, La Estrella y el Centro de Manizales',
    titleEn:
      'Specialty Coffee & Bakery Route in El Cable, La Estrella, and Downtown Manizales',
    slug: 'ruta-del-cafe-de-especialidad-manizales-el-cable-la-estrella',
    summary:
      'Recorrimos las mejores barras de café de origen caldense y pastelerías tradicionales para trabajar remoto o disfrutar de una tarde en Manizales.',
    summaryEn:
      'We toured the top Caldas single-origin coffee bars and traditional bakeries for remote work or an afternoon in Manizales.',
    content:
      'Como corazón del Paisaje Cultural Cafetero, Manizales ofrece una de las escenas de café de especialidad y pastelería más ricas de Colombia. Desde íconos tradicionales como La Suiza en El Cable y el Centro, hasta barras de microlotes como Santo Kaffeto, Differente Coffee y Café San Alberto en Cable Plaza.\n\nEn nuestro directorio puedes filtrar por barrio (El Cable, La Estrella, Milán, Centro, Palermo, Sancancio) para descubrir tu próximo café favorito y dejar tu reseña con estrellas.',
    contentEn:
      "As the heart of the Coffee Cultural Landscape, Manizales offers one of Colombia's richest specialty coffee and bakery scenes. From traditional icons like La Suiza in El Cable and Downtown, to micro-lot bars like Santo Kaffeto, Differente Coffee, and Café San Alberto at Cable Plaza.\n\nUse Knect's neighborhood filters (El Cable, La Estrella, Milán, Centro, Palermo, Sancancio) to discover your next favorite spot and leave your star rating.",
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Comunidad Knect Caldas',
    publishedAt: '2026-10-25T09:00:00',
    isActive: true,
  },
];

@Injectable({ providedIn: 'root' })
export class KnectDataService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private localBusinesses: Business[] = [...FALLBACK_BUSINESSES];
  private localReviews: Review[] = [...FALLBACK_REVIEWS];
  private localPosts: BlogPost[] = [...FALLBACK_POSTS];
  private localContactMessages: ContactMessage[] = [];
  private localHomeCms: HomeCms = {
    heroTitleEs: 'Conectamos a Manizales con sus mejores comercios locales',
    heroTitleEn: 'Connecting Manizales with its best local businesses',
    heroSubtitleEs:
      'Explora restaurantes, cafés de especialidad, tiendas y servicios en El Cable, Milán, Palermo, Sancancio, Chipre y el Centro. Ubica sus sedes en el mapa interactivo y habla directo por WhatsApp.',
    heroSubtitleEn:
      'Explore restaurants, specialty cafes, stores, and services across El Cable, Milán, Palermo, Sancancio, Chipre, and Downtown Manizales. Locate branches on the interactive map and chat via WhatsApp.',
    heroBannerUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    heroCtaTextEs: 'Explorar Directorio de Manizales',
    heroCtaTextEn: 'Explore Manizales Directory',
    featuredTitleEs: 'Locales Destacados en Manizales',
    featuredTitleEn: 'Featured Establishments in Manizales',
    newsTitleEs: 'Últimas Noticias y Artículos de la Ciudad',
    newsTitleEn: 'Latest City News & Articles',
    contactTitleEs: 'Contáctanos – Administración Knect Manizales',
    contactTitleEn: 'Contact Us – Knect Manizales Administration',
    contactSubtitleEs:
      '¿Quieres vincular tu establecimiento en Manizales al directorio o necesitas soporte? Envíanos un mensaje y recibirás respuesta inmediata.',
    contactSubtitleEn:
      'Want to list your Manizales establishment in the directory or need support? Send us a message and get an immediate response.',
    contactEmail: 'administracion@knect.com',
    contactPhone: '+57 (606) 885 9000',
    contactAddress: 'Centro de Negocios Siglo XXI, Sector El Cable, Manizales, Caldas',
  };

  getCategories(): Observable<EstablishmentType[]> {
    return this.api.get<EstablishmentType[]>('categories').pipe(
      catchError(() => of(FALLBACK_CATEGORIES)),
    );
  }

  getNeighborhoods(): Observable<string[]> {
    return this.api.get<string[]>('neighborhoods').pipe(
      catchError(() =>
        of(['El Cable', 'Milán', 'Palermo', 'Sancancio', 'Chipre', 'Centro', 'La Estrella']),
      ),
    );
  }

  getFeaturedBusinesses(): Observable<Business[]> {
    return this.api.get<Business[]>('businesses/featured').pipe(
      catchError(() =>
        of(this.localBusinesses.filter((b) => b.isActive !== false && b.isFeatured)),
      ),
    );
  }

  getCatalog(params: {
    search?: string;
    neighborhood?: string;
    categoryId?: number | null;
    isGhostKitchen?: boolean | null;
    page?: number;
    size?: number;
  }): Observable<PaginatedResponse<Business>> {
    const query: Record<string, string | number> = {
      page: params.page ?? 0,
      size: params.size ?? 6,
    };
    if (params.search?.trim()) query['search'] = params.search.trim();
    if (params.neighborhood?.trim()) query['neighborhood'] = params.neighborhood.trim();
    if (params.categoryId) query['categoryId'] = params.categoryId;
    if (params.isGhostKitchen !== null && params.isGhostKitchen !== undefined) {
      query['isGhostKitchen'] = String(params.isGhostKitchen);
    }

    return this.api.get<PaginatedResponse<Business>>('businesses/catalog', query).pipe(
      catchError(() => {
        let filtered = this.localBusinesses.filter((b) => b.isActive !== false);
        if (params.categoryId) {
          filtered = filtered.filter((b) => b.establishmentTypeId === Number(params.categoryId));
        }
        if (params.isGhostKitchen !== null && params.isGhostKitchen !== undefined) {
          filtered = filtered.filter((b) => Boolean(b.isGhostKitchen) === params.isGhostKitchen);
        }
        if (params.neighborhood?.trim()) {
          const n = params.neighborhood.trim().toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.neighborhood?.toLowerCase().includes(n) ||
              b.establishments?.some((e) => e.neighborhood?.toLowerCase().includes(n)),
          );
        }
        if (params.search?.trim()) {
          const q = params.search.trim().toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.description?.toLowerCase().includes(q) ||
              b.neighborhood?.toLowerCase().includes(q) ||
              b.category?.toLowerCase().includes(q),
          );
        }
        const page = params.page ?? 0;
        const size = params.size ?? 6;
        const totalElements = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalElements / size));
        const start = page * size;
        return of({
          content: filtered.slice(start, start + size),
          page,
          size,
          totalElements,
          totalPages,
        });
      }),
    );
  }

  getBusinessById(id: number | string): Observable<Business> {
    return this.api.get<Business>(`businesses/${id}`).pipe(
      catchError(() => {
        const found =
          this.localBusinesses.find((b) => b.id === Number(id)) || this.localBusinesses[0];
        return of(found);
      }),
    );
  }

  registerWhatsappClick(businessId: number, establishmentId?: number): Observable<unknown> {
    const path = establishmentId
      ? `businesses/${businessId}/whatsapp-click?establishmentId=${establishmentId}`
      : `businesses/${businessId}/whatsapp-click`;
    return this.api.post(path, {}).pipe(
      catchError(() => {
        const found = this.localBusinesses.find((b) => b.id === businessId);
        if (found) found.whatsappClickCount = (found.whatsappClickCount || 0) + 1;
        return of({ success: true });
      }),
    );
  }

  getBusinessReviews(businessId: number | string): Observable<Review[]> {
    return this.api.get<Review[]>(`businesses/${businessId}/reviews`).pipe(
      catchError(() =>
        of(this.localReviews.filter((r) => r.businessId === Number(businessId))),
      ),
    );
  }

  createOrUpdateReview(
    businessId: number,
    payload: { rating: number; comment: string; establishmentId?: number },
  ): Observable<Review> {
    return this.api.post<Review>(`businesses/${businessId}/reviews`, payload).pipe(
      catchError(() => {
        const user = this.auth.user();
        const userId = user?.id || 4;
        const existingIdx = this.localReviews.findIndex(
          (r) => r.businessId === businessId && r.userId === userId,
        );
        const review: Review = {
          id: existingIdx >= 0 ? this.localReviews[existingIdx].id : Date.now(),
          businessId,
          userId,
          userName: user ? `${user.name} ${user.lastName || ''}`.trim() : 'Cliente Knect',
          rating: payload.rating,
          comment: payload.comment,
          createAt: new Date().toISOString(),
        };
        if (existingIdx >= 0) {
          this.localReviews[existingIdx] = { ...this.localReviews[existingIdx], ...review };
        } else {
          this.localReviews.unshift(review);
        }
        return of(review);
      }),
    );
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.api.get<BlogPost[]>('blog-posts').pipe(
      catchError(() => of(this.localPosts.filter((p) => p.isActive !== false))),
    );
  }

  getBlogPostDetail(idOrSlug: string): Observable<BlogPost> {
    return this.api.get<BlogPost>(`blog-posts/${idOrSlug}`).pipe(
      catchError(() => {
        const found =
          this.localPosts.find(
            (p) => p.slug === idOrSlug || String(p.postId || p.id) === idOrSlug,
          ) || this.localPosts[0];
        return of(found);
      }),
    );
  }

  getHomeCms(): Observable<HomeCms> {
    return this.api.get<HomeCms>('cms/home').pipe(
      catchError(() => of(this.localHomeCms)),
    );
  }

  submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.api.post<{ success: boolean; message: string }>('contact', data).pipe(
      catchError(() => {
        this.localContactMessages.unshift({
          contactId: Date.now(),
          ...data,
          emailSent: true,
          isRead: false,
          createAt: new Date().toISOString(),
        });
        return of({
          success: true,
          message:
            'Tu mensaje ha sido enviado y notificado por correo a la administración de Knect Manizales.',
        });
      }),
    );
  }

  // --- Brand Admin (Módulo 4) ---
  getMyBusiness(businessId?: number): Observable<Business> {
    const path = businessId ? `my-business?businessId=${businessId}` : 'my-business';
    return this.api.get<Business>(path).pipe(
      catchError(() => {
        const user = this.auth.user();
        if (businessId) {
          const foundById = this.localBusinesses.find((b) => b.id === Number(businessId));
          if (foundById) return of(foundById);
        }
        if (user?.role === 'SUPER_ADMIN') {
          return of(this.localBusinesses[0]);
        }
        const foundByEmail =
          this.localBusinesses.find((b) => b.ownerEmail?.toLowerCase() === user?.email?.toLowerCase()) ||
          this.localBusinesses[0];
        return of(foundByEmail);
      }),
    );
  }

  updateMyBusiness(data: Partial<Business>, businessId?: number): Observable<Business> {
    const path = businessId ? `my-business?businessId=${businessId}` : 'my-business';
    return this.api.put<Business>(path, data).pipe(
      catchError(() => {
        const targetId = businessId || data.id || this.localBusinesses[0].id;
        const idx = this.localBusinesses.findIndex((b) => b.id === targetId);
        const targetIdx = idx >= 0 ? idx : 0;
        const typeId = Number(data.establishmentTypeId ?? this.localBusinesses[targetIdx].establishmentTypeId ?? 1);
        const matchedCat = FALLBACK_CATEGORIES.find((c) => c.establishmentTypeId === typeId);
        this.localBusinesses[targetIdx] = {
          ...this.localBusinesses[targetIdx],
          ...data,
          establishmentTypeId: typeId,
          category: matchedCat ? matchedCat.name : this.localBusinesses[targetIdx].category,
          categoryEn: matchedCat ? matchedCat.nameEn : this.localBusinesses[targetIdx].categoryEn,
        };
        return of(this.localBusinesses[targetIdx]);
      }),
    );
  }

  createMyEstablishment(data: Partial<EstablishmentBranch>, businessId?: number): Observable<EstablishmentBranch> {
    const path = businessId ? `my-business/establishments?businessId=${businessId}` : 'my-business/establishments';
    return this.api.post<EstablishmentBranch>(path, data).pipe(
      catchError(() => {
        const targetBiz = businessId
          ? this.localBusinesses.find((b) => b.id === Number(businessId)) || this.localBusinesses[0]
          : this.localBusinesses[0];
        const created: EstablishmentBranch = {
          id: Date.now(),
          establishmentId: Date.now(),
          businessId: targetBiz.id,
          name: data.name || 'Nueva Sede Manizales',
          address: data.address || '',
          neighborhood: data.neighborhood || 'El Cable',
          latitude: data.latitude ?? 5.0563,
          longitude: data.longitude ?? -75.4864,
          phone: data.phone || '',
          whatsapp: data.whatsapp || data.phone || '',
          schedules: data.schedules || 'Lun - Dom: 9:00 AM - 9:00 PM',
          isActive: true,
          whatsappClicks: 0,
        };
        targetBiz.establishments = [
          ...(targetBiz.establishments || []),
          created,
        ];
        return of(created);
      }),
    );
  }

  updateMyEstablishment(
    establishmentId: number,
    data: Partial<EstablishmentBranch>,
  ): Observable<EstablishmentBranch> {
    return this.api
      .put<EstablishmentBranch>(`my-business/establishments/${establishmentId}`, data)
      .pipe(
        catchError(() => {
          for (const biz of this.localBusinesses) {
            const branches = biz.establishments || [];
            const idx = branches.findIndex((e) => (e.establishmentId || e.id) === establishmentId);
            if (idx >= 0) {
              branches[idx] = { ...branches[idx], ...data };
              return of(branches[idx]);
            }
          }
          return of(data as EstablishmentBranch);
        }),
      );
  }

  deleteMyEstablishment(establishmentId: number): Observable<unknown> {
    return this.api.delete(`my-business/establishments/${establishmentId}`).pipe(
      catchError(() => {
        for (const biz of this.localBusinesses) {
          if (biz.establishments) {
            biz.establishments = biz.establishments.filter(
              (e) => (e.establishmentId || e.id) !== establishmentId,
            );
          }
        }
        return of({ success: true });
      }),
    );
  }

  getMyReviews(businessId?: number): Observable<Review[]> {
    const path = businessId ? `my-business/reviews?businessId=${businessId}` : 'my-business/reviews';
    return this.api.get<Review[]>(path).pipe(
      catchError(() => {
        const targetId = businessId || (this.auth.user()?.role === 'SUPER_ADMIN' ? this.localBusinesses[0].id : 1);
        return of(this.localReviews.filter((r) => r.businessId === targetId));
      }),
    );
  }

  replyToReview(reviewId: number, adminReply: string): Observable<Review> {
    return this.api.put<Review>(`my-business/reviews/${reviewId}/reply`, { adminReply }).pipe(
      catchError(() => {
        const rev = this.localReviews.find((r) => (r.reviewId || r.id) === reviewId);
        if (rev) {
          rev.adminReply = adminReply;
          rev.adminReplyAt = new Date().toISOString();
          return of(rev);
        }
        return of(this.localReviews[0]);
      }),
    );
  }

  getMyAnalytics(businessId?: number): Observable<BusinessAnalytics> {
    const path = businessId ? `my-business/analytics?businessId=${businessId}` : 'my-business/analytics';
    return this.api.get<BusinessAnalytics>(path).pipe(
      catchError(() => {
        const b = businessId
          ? this.localBusinesses.find((item) => item.id === Number(businessId)) || this.localBusinesses[0]
          : this.localBusinesses[0];
        const reviews = this.localReviews.filter((r) => r.businessId === b.id);
        const replied = reviews.filter((r) => !!r.adminReply).length;
        return of({
          businessId: b.id,
          businessName: b.name,
          ratingAvg: b.ratingAvg || 4.9,
          reviewCount: reviews.length,
          viewCount: b.viewCount || 412,
          searchAppearanceCount: b.searchAppearanceCount || 620,
          whatsappClickCount: b.whatsappClickCount || 154,
          totalBranches: b.establishments?.length || 1,
          repliedReviewsCount: replied,
          pendingReviewsCount: reviews.length - replied,
          branchesPerformance: b.establishments || [],
        });
      }),
    );
  }

  // --- Super Admin (Módulo 5) ---
  getAdminBusinesses(search = '', page = 0, size = 8): Observable<PaginatedResponse<Business>> {
    return this.api
      .get<PaginatedResponse<Business>>('admin/businesses', { search, page, size })
      .pipe(
        catchError(() => {
          const term = search.trim().toLowerCase();
          const filtered = !term
            ? this.localBusinesses
            : this.localBusinesses.filter(
                (b) =>
                  (b.name || '').toLowerCase().includes(term) ||
                  (b.category || '').toLowerCase().includes(term) ||
                  (b.neighborhood || '').toLowerCase().includes(term) ||
                  (b.ownerName || '').toLowerCase().includes(term),
              );
          const start = page * size;
          const content = filtered.slice(start, start + size);
          return of({
            content,
            page,
            size,
            totalElements: filtered.length,
            totalPages: Math.max(1, Math.ceil(filtered.length / size)),
          });
        }),
      );
  }

  createAdminBusiness(data: Partial<Business>): Observable<Business> {
    return this.api.post<Business>('admin/businesses', data).pipe(
      catchError(() => {
        const typeId = Number(data.establishmentTypeId) || 1;
        const matchedCat = FALLBACK_CATEGORIES.find((c) => c.establishmentTypeId === typeId);
        const createdName = data.name || 'Nuevo Comercio Knect';
        const created: Business = {
          id: Date.now(),
          businessId: Date.now(),
          name: createdName,
          legalName: data.legalName || createdName,
          taxNumber: data.taxNumber || '',
          description: data.description || '',
          descriptionEn: data.descriptionEn || '',
          primaryColor: data.primaryColor || '#00A3FF',
          neighborhood: data.neighborhood || 'El Cable',
          address: data.address || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          website: data.website || '',
          logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
          bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
          category: matchedCat ? matchedCat.name : 'Restaurante',
          categoryEn: matchedCat ? matchedCat.nameEn : 'Restaurant',
          establishmentTypeId: typeId,
          isGhostKitchen: Boolean(data.isGhostKitchen),
          hasDineIn: data.hasDineIn ?? true,
          isFeatured: Boolean(data.isFeatured),
          isActive: data.isActive !== false,
          ratingAvg: 5.0,
          reviewCount: 0,
          establishments: [],
        };
        this.localBusinesses.unshift(created);
        return of(created);
      }),
    );
  }

  updateAdminBusiness(id: number, data: Partial<Business>): Observable<Business> {
    return this.api.put<Business>(`admin/businesses/${id}`, data).pipe(
      catchError(() => {
        const idx = this.localBusinesses.findIndex((b) => b.id === id);
        if (idx >= 0) {
          const typeId = Number(data.establishmentTypeId ?? this.localBusinesses[idx].establishmentTypeId ?? 1);
          const matchedCat = FALLBACK_CATEGORIES.find((c) => c.establishmentTypeId === typeId);
          const updatedName = data.name || this.localBusinesses[idx].name;
          this.localBusinesses[idx] = {
            ...this.localBusinesses[idx],
            ...data,
            name: updatedName,
            establishmentTypeId: typeId,
            category: matchedCat ? matchedCat.name : this.localBusinesses[idx].category,
            categoryEn: matchedCat ? matchedCat.nameEn : this.localBusinesses[idx].categoryEn,
          };
          return of(this.localBusinesses[idx]);
        }
        return of(data as Business);
      }),
    );
  }

  toggleFeaturedBusiness(id: number): Observable<Business> {
    return this.api.patch<Business>(`admin/businesses/${id}/toggle-featured`, {}).pipe(
      catchError(() => {
        const b = this.localBusinesses.find((item) => item.id === id);
        if (b) b.isFeatured = !b.isFeatured;
        return of(b || this.localBusinesses[0]);
      }),
    );
  }

  toggleActiveBusiness(id: number): Observable<Business> {
    return this.api.patch<Business>(`admin/businesses/${id}/toggle-active`, {}).pipe(
      catchError(() => {
        const b = this.localBusinesses.find((item) => item.id === id);
        if (b) b.isActive = !b.isActive;
        return of(b || this.localBusinesses[0]);
      }),
    );
  }

  transferBusinessOwner(businessId: number, ownerUserId: number): Observable<Business> {
    return this.api.put<Business>(`admin/businesses/${businessId}/owner`, { ownerUserId }).pipe(
      catchError(() => {
        const b = this.localBusinesses.find((item) => item.id === businessId);
        if (b) b.ownerUserId = ownerUserId;
        return of(b || this.localBusinesses[0]);
      }),
    );
  }

  deleteAdminBusiness(id: number): Observable<unknown> {
    return this.api.delete(`admin/businesses/${id}`).pipe(
      catchError(() => {
        this.localBusinesses = this.localBusinesses.filter((b) => b.id !== id);
        return of({ success: true });
      }),
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>('admin/users').pipe(
      catchError(() =>
        of([
          { id: 1, name: 'Sergio', lastName: 'Alzate Román', email: 'admin@knect.com', role: 'SUPER_ADMIN' },
          { id: 2, name: 'Carlos', lastName: 'Restrepo', email: 'marca@knect.com', role: 'BUSINESS_ADMIN' },
          { id: 3, name: 'Valentina', lastName: 'Ospina', email: 'darkkitchen@knect.com', role: 'BUSINESS_ADMIN' },
          { id: 4, name: 'María Camila', lastName: 'Gómez', email: 'cliente@knect.com', role: 'CLIENT' },
        ]),
      ),
    );
  }

  updateHomeCms(data: HomeCms): Observable<unknown> {
    return this.api.put('admin/cms/home', data).pipe(
      catchError(() => {
        this.localHomeCms = { ...data };
        return of({ success: true });
      }),
    );
  }

  getAdminBlogPosts(): Observable<BlogPost[]> {
    return this.api.get<BlogPost[]>('admin/blog-posts').pipe(
      catchError(() => of(this.localPosts)),
    );
  }

  createAdminBlogPost(post: Partial<BlogPost>): Observable<BlogPost> {
    return this.api.post<BlogPost>('admin/blog-posts', post).pipe(
      catchError(() => {
        const created: BlogPost = {
          postId: Date.now(),
          id: Date.now(),
          title: post.title || 'Nueva Noticia Manizales',
          titleEn: post.titleEn || post.title || 'New Article',
          slug: 'noticia-' + Date.now(),
          summary: post.summary || '',
          summaryEn: post.summaryEn || '',
          content: post.content || '',
          contentEn: post.contentEn || '',
          imageUrl:
            post.imageUrl ||
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
          authorName: post.authorName || 'Administración Knect Manizales',
          publishedAt: new Date().toISOString(),
          isActive: post.isActive ?? true,
        };
        this.localPosts.unshift(created);
        return of(created);
      }),
    );
  }

  updateAdminBlogPost(id: number, post: Partial<BlogPost>): Observable<BlogPost> {
    return this.api.put<BlogPost>(`admin/blog-posts/${id}`, post).pipe(
      catchError(() => {
        const idx = this.localPosts.findIndex((p) => (p.postId || p.id) === id);
        if (idx >= 0) {
          this.localPosts[idx] = { ...this.localPosts[idx], ...post };
          return of(this.localPosts[idx]);
        }
        return of(post as BlogPost);
      }),
    );
  }

  deleteAdminBlogPost(id: number): Observable<unknown> {
    return this.api.delete(`admin/blog-posts/${id}`).pipe(
      catchError(() => {
        this.localPosts = this.localPosts.filter((p) => (p.postId || p.id) !== id);
        return of({ success: true });
      }),
    );
  }

  getContactMessages(): Observable<ContactMessage[]> {
    return this.api.get<ContactMessage[]>('admin/contact-messages').pipe(
      catchError(() => of(this.localContactMessages)),
    );
  }

  getGlobalAnalytics(): Observable<GlobalAnalytics> {
    return this.api.get<GlobalAnalytics>('admin/analytics').pipe(
      catchError(() =>
        of({
          totalVisits: 1763,
          totalActiveBusinesses: this.localBusinesses.filter((b) => b.isActive !== false).length,
          totalBusinesses: this.localBusinesses.length,
          totalBranches: 13,
          totalUsers: 4,
          totalReviews: this.localReviews.length,
          totalBlogPosts: this.localPosts.length,
          totalSearchQueries: 42,
          totalWhatsappClicks: 733,
          totalContactMessages: this.localContactMessages.length,
          recentSearches: [
            'Café en El Cable',
            'Restaurantes Zona G Milán',
            'La Suiza Manizales',
            'Hamburguesas Palermo',
            'tiendas C.C. Sancancio',
          ],
          businessesByCategory: {
            Restaurante: 2,
            'Café & Panadería': 2,
            'Tienda & Comercio': 1,
            Servicios: 1,
          },
          topBusinessesByWhatsapp: this.localBusinesses.slice(0, 4),
        }),
      ),
    );
  }
}
