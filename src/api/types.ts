/** BerryListings API types */

export type PropertyType = 'HOUSE' | 'CONDO' | 'TOWNHOME' | 'LAND';

export type PropertyStatus = 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number | null;
  yearBuilt: number | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  images: PropertyImage[];
  agent: PropertyAgent | null;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertiesResponse {
  data: Property[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PropertyResponse {
  data: Property;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
