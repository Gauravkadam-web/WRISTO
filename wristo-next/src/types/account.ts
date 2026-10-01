export interface CollectorProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  salutation: 'Mr.' | 'Ms.' | 'Dr.' | 'Lord' | 'Collector';
  vipTier: 'Patron Connoisseur' | 'Grand Complication Patron' | 'Horological Fellow';
  joinedDate: string;
  wristSizeMm: number;
  currency: 'INR';
  notifications: {
    orderTelemetry: boolean;
    rareAllocations: boolean;
    conciergeBriefings: boolean;
  };
}

export interface SavedAddress {
  id: string;
  label: string; // e.g. 'Primary Residence', 'Corporate Suite', 'Private Estate'
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type AccountTab = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';
