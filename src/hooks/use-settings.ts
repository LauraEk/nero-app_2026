import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'nero_settings';

export interface CompanySettings {
    companyName: string;
    ownerName: string;
    address: string;
    email: string;
    website: string;
    taxId: string;
    logoUrl: string | null;
    primaryColor: string;
    theme: 'light' | 'dark' | 'system';
}

const defaultSettings: CompanySettings = {
    companyName: '',
    ownerName: '',
    address: '',
    email: '',
    website: '',
    taxId: '',
    logoUrl: null,
    primaryColor: '#0f172a',
    theme: 'system',
};

export function useSettings() {
    const [settings, setSettings] = useState<CompanySettings>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            return stored ? JSON.parse(stored) : defaultSettings;
        } catch (error) {
            console.error('Error loading settings:', error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }, [settings]);

    const updateSettings = (newSettings: Partial<CompanySettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return { settings, updateSettings };
}
