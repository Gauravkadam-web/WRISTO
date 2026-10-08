import { CollectorProfile, SavedAddress } from '@/types/account';
import { apiClient } from './apiClient';

export async function getCollectorProfile(): Promise<CollectorProfile | null> {
  try {
    const res = await apiClient.get<CollectorProfile>('/account/profile').catch(() => null);
    if (res && res.data) {
      return res.data;
    }
  } catch {
    return null;
  }
  return null;
}

export async function updateCollectorProfile(
  updated: Partial<CollectorProfile>
): Promise<CollectorProfile> {
  const payload = {
    fullName: updated.fullName,
    phone: updated.phone,
    salutation: updated.salutation,
    wristSizeMm: updated.wristSizeMm,
    currency: updated.currency,
    orderTelemetry: updated.notifications?.orderTelemetry ?? true,
    rareAllocations: updated.notifications?.rareAllocations ?? true,
    conciergeBriefings: updated.notifications?.conciergeBriefings ?? false
  };

  const res = await apiClient.put<CollectorProfile>('/account/profile', payload);
  if (res && res.data) {
    return res.data;
  }
  throw new Error('Failed to update collector profile in primary ledger.');
}

export async function getSavedAddresses(): Promise<SavedAddress[]> {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('wristo_addresses');
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore
  }
  return [];
}

export async function saveAddress(
  payload: Omit<SavedAddress, 'id'> & { id?: string }
): Promise<SavedAddress> {
  const list = await getSavedAddresses();
  let updatedItem: SavedAddress;

  if (payload.id) {
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
