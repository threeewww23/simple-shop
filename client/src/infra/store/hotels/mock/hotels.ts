import type Hotel from '@/domain/entities/Hotel'

export const hotels: Hotel[] = [
  {
    id: 1,
    title: 'Air Runner X1',
    subtitle: 'Лёгкие беговые кроссовки на каждый день',
    description: 'Удобная амортизация, дышащий верх и цепкая подошва для города и зала.',
    address: 'Склад: Москва',
    rating: {
      votesCount: '1.2K',
      rating: 4.8,
      stars: 5,
    },
    ratingsCount: 1200,
    award: {
      name: 'Хит продаж',
      section: 'Бег',
    },
    chart: {
      place: 1,
      category: 'Кроссовки',
    },
    price: 8900,
    picture: 'https://placehold.co/600x400?text=Air+Runner+X1',
    rooms: [
      {
        id: 1,
        title: 'Air Runner X1',
        subtitle: 'Размеры: 40-45',
        price: 8900,
        picture: 'https://placehold.co/600x400?text=Air+Runner+X1',
      },
    ],
  },
  {
    id: 2,
    title: 'Street Flex Pro',
    subtitle: 'Повседневные кроссовки в уличном стиле',
    description: 'Мягкая стелька, усиленная пятка и универсальный дизайн под любой образ.',
    address: 'Склад: Санкт-Петербург',
    rating: {
      votesCount: '980',
      rating: 4.7,
      stars: 5,
    },
    ratingsCount: 980,
    award: {
      name: 'Выбор покупателей',
      section: 'Casual',
    },
    chart: {
      place: 2,
      category: 'Кроссовки',
    },
    price: 7600,
    picture: 'https://placehold.co/600x400?text=Street+Flex+Pro',
    rooms: [
      {
        id: 1,
        title: 'Street Flex Pro',
        subtitle: 'Размеры: 39-44',
        price: 7600,
        picture: 'https://placehold.co/600x400?text=Street+Flex+Pro',
      },
    ],
  },
  {
    id: 3,
    title: 'Court Classic 90',
    subtitle: 'Классические кеды для повседневной носки',
    description: 'Лаконичный силуэт, прочный верх и удобная посадка на весь день.',
    address: 'Склад: Казань',
    rating: {
      votesCount: '760',
      rating: 4.6,
      stars: 4.5,
    },
    ratingsCount: 760,
    award: {
      name: 'Новая коллекция',
      section: 'Classic',
    },
    chart: {
      place: 3,
      category: 'Кроссовки',
    },
    price: 6900,
    picture: 'https://placehold.co/600x400?text=Court+Classic+90',
    rooms: [
      {
        id: 1,
        title: 'Court Classic 90',
        subtitle: 'Размеры: 38-44',
        price: 6900,
        picture: 'https://placehold.co/600x400?text=Court+Classic+90',
      },
    ],
  },
  {
    id: 4,
    title: 'Trail Storm GTX',
    subtitle: 'Трекинговые кроссовки для сложных условий',
    description: 'Влагозащитный верх, агрессивный протектор и стабильность на любой поверхности.',
    address: 'Склад: Екатеринбург',
    rating: {
      votesCount: '540',
      rating: 4.9,
      stars: 5,
    },
    ratingsCount: 540,
    award: {
      name: 'Топ для outdoor',
      section: 'Trail',
    },
    chart: {
      place: 1,
      category: 'Outdoor',
    },
    price: 11200,
    picture: 'https://placehold.co/600x400?text=Trail+Storm+GTX',
    rooms: [
      {
        id: 1,
        title: 'Trail Storm GTX',
        subtitle: 'Размеры: 41-46',
        price: 11200,
        picture: 'https://placehold.co/600x400?text=Trail+Storm+GTX',
      },
    ],
  },
]
