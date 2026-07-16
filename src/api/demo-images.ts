/** Local demo images fetched from Unsplash via fetch-unsplash-images.py */

const images: Record<string, string[]> = {
  HOUSE: [
    '/images/modern-house-exterior-01.jpg',
    '/images/modern-house-exterior-02.jpg',
    '/images/modern-house-exterior-03.jpg',
  ],
  CONDO: [
    '/images/luxury-condo-building-01.jpg',
    '/images/luxury-condo-building-02.jpg',
    '/images/luxury-condo-building-03.jpg',
  ],
  TOWNHOME: [
    '/images/townhouse-exterior-01.jpg',
    '/images/townhouse-exterior-02.jpg',
    '/images/townhouse-exterior-03.jpg',
  ],
  LAND: [
    '/images/landscaped-garden-01.jpg',
    '/images/landscaped-garden-02.jpg',
    '/images/landscaped-garden-03.jpg',
  ],
};

export function demoImage(type: string): string {
  const imgs = images[type] ?? images.HOUSE;
  return imgs[Math.floor(Math.random() * imgs.length)];
}

export const heroImages = [
  '/images/modern-house-exterior-01.jpg',
  '/images/luxury-condo-building-01.jpg',
  '/images/apartment-interior-01.jpg',
];
