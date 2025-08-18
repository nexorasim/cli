
export interface ESimPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  price: number;
  priceFormatted: string;
  features: string[];
  isPopular?: boolean;
  isAvailable?: boolean;
}

export const esimPlans: ESimPlan[] = [
  {
    id: 'tourist-7',
    name: 'Tourist Pack',
    data: '5 GB',
    validity: '7 Days',
    price: 35000,
    priceFormatted: '35,000 MMK',
    features: ['High-speed 4G/LTE', 'Nationwide Coverage', 'Ideal for short trips'],
    isAvailable: false,
  },
  {
    id: 'power-30',
    name: 'Power User',
    data: '15 GB',
    validity: '30 Days',
    price: 80000,
    priceFormatted: '80,000 MMK',
    features: ['Best Value', 'High-speed 4G/LTE/5G', 'Perfect for residents & long stays'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'business-30',
    name: 'Business Pro',
    data: '30 GB',
    validity: '30 Days',
    price: 120000,
    priceFormatted: '120,000 MMK',
    features: ['Maximum Data', 'Priority 5G Access', '24/7 Premium Support'],
    isAvailable: false,
  },
];
