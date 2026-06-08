import { create } from 'zustand';
import { type CompanySettings, getCompanySettings } from '@/services/companySettingsService';

interface SettingsState {
  settings: CompanySettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  setSettings: (settings: CompanySettings | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,
  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCompanySettings();
      if (data) {
        set({ settings: data, loading: false });
      } else {
        set({ error: 'No settings data found', loading: false });
      }
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to fetch settings', loading: false });
    }
  },
  setSettings: (settings) => set({ settings }),
}));
