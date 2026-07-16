/** BerryListings API types — matches actual API response */

export type PropertyType = 'HOUSE' | 'CONDO' | 'TOWNHOME' | 'LAND';
export type PropertyStatus = 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD';

export interface PropertyPhoto {
  id: number;
  url: string;
  position: number;
  alt?: string | null;
}

export interface PropertyAgent {
  uuid: string;
  email: string;
  role?: string;
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface Property {
  uuid: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  addressLine: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSizeAcres: number | null;
  lotSize?: number | null;
  yearBuilt: number | null;
  amenities: string[];
  photos: PropertyPhoto[];
  images?: PropertyPhoto[];
  agent: PropertyAgent | null;
  createdAt: string;
  updatedAt: string;
  state?: string;
  zipCode?: string;
  street?: string;
  squareFeet?: number;
  propertyType?: PropertyType;
}

export interface PropertiesResponse {
  message: string;
  data: Property[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PropertyResponse {
  message: string;
  data: Property;
}
