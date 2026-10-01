import { CollectorProfile, SavedAddress } from '@/types/account';

export const DEFAULT_PROFILE: CollectorProfile = {
  id: 'USR-WRISTO-08492',
  fullName: 'Aditya Vikram Singhania',
  email: 'aditya.singhania@horology.com',
  phone: '+91 98201 98201',
  salutation: 'Collector',
  vipTier: 'Patron Connoisseur',
  joinedDate: 'October 2024',
  wristSizeMm: 175,
  currency: 'INR',
  notifications: {
    orderTelemetry: true,
    rareAllocations: true,
    conciergeBriefings: false
  }
};

export const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'ADDR-01',
    label: 'Primary Residence',
    fullName: 'Aditya Vikram Singhania',
    phone: '+91 98201 98201',
    addressLine1: 'Penthouse 12, Altamount Towers, Altamount Road',
    addressLine2: 'Near Royal Opera House',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isDefault: true
  },
  {
    id: 'ADDR-02',
    label: 'Corporate Suite',
    fullName: 'Aditya Vikram Singhania',
    phone: '+91 98201 98201',
    addressLine1: 'Executive Floor 34, Maker Chambers VI, Nariman Point',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400021',
    isDefault: false
  }
];

export async function getCollectorProfile(): Promise<CollectorProfile> {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const saved = localStorage.getItem('wristo_profile');
    if (!saved) {
      localStorage.setItem('wristo_profile', JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(saved);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function updateCollectorProfile(
  updated: Partial<CollectorProfile>
): Promise<CollectorProfile> {
  const current = await getCollectorProfile();
  const next = { ...current, ...updated };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wristo_profile', JSON.stringify(next));
    } catch {
      // Ignore
    }
  }
  return next;
}

export async function getSavedAddresses(): Promise<SavedAddress[]> {
  if (typeof window === 'undefined') return DEFAULT_ADDRESSES;
  try {
    const saved = localStorage.getItem('wristo_addresses');
    if (!saved) {
      localStorage.setItem('wristo_addresses', JSON.stringify(DEFAULT_ADDRESSES));
      return DEFAULT_ADDRESSES;
    }
    return JSON.parse(saved);
  } catch {
    return DEFAULT_ADDRESSES;
  }
}

export async function saveAddress(
  payload: Omit<SavedAddress, 'id'> & { id?: string }
): Promise<SavedAddress> {
  const list = await getSavedAddresses();
  let updatedItem: SavedAddress;

  if (payload.id) {
    // Update existing
    updatedItem = payload as SavedAddress;
    const nextList = list.map(item => (item.id === payload.id ? updatedItem : item));
    if (payload.isDefault) {
      nextList.forEach(item => {
        if (item.id !== payload.id) item.isDefault = false;
      });
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_addresses', JSON.stringify(nextList));
    }
  } else {
    // Create new
    const newId = `ADDR-${Date.now().toString().slice(-4)}`;
    updatedItem = { ...payload, id: newId };
    let nextList = [updatedItem, ...list];
    if (payload.isDefault || list.length === 0) {
      updatedItem.isDefault = true;
      nextList.forEach(item => {
        if (item.id !== newId) item.isDefault = false;
      });
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_addresses', JSON.stringify(nextList));
    }
  }

  return updatedItem;
}

export async function deleteAddress(id: string): Promise<SavedAddress[]> {
  const list = await getSavedAddresses();
  const nextList = list.filter(item => item.id !== id);
  if (nextList.length > 0 && !nextList.some(item => item.isDefault)) {
    nextList[0].isDefault = true;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('wristo_addresses', JSON.stringify(nextList));
  }
  return nextList;
}

export async function setDefaultAddress(id: string): Promise<SavedAddress[]> {
  const list = await getSavedAddresses();
  const nextList = list.map(item => ({
    ...item,
    isDefault: item.id === id
  }));
  if (typeof window !== 'undefined') {
    localStorage.setItem('wristo_addresses', JSON.stringify(nextList));
  }
  return nextList;
}
