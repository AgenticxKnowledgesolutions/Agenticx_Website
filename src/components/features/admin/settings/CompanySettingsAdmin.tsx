import React, { useState, useEffect } from 'react';
import { type CompanySettings, getCompanySettings, updateCompanySettings } from '@/services/companySettingsService';
import { useToast } from '@/components/ui/Toast';
import '../Admin.css';

export default function CompanySettingsAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [companyTagline, setCompanyTagline] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  const [placementAssistancePercentage, setPlacementAssistancePercentage] = useState<number | ''>('');
  const [collegePartnersCount, setCollegePartnersCount] = useState<number | ''>('');
  const [graduatesTrainedCount, setGraduatesTrainedCount] = useState<number | ''>('');
  const [studentsTrainedCount, setStudentsTrainedCount] = useState<number | ''>('');
  const [coreServicesCount, setCoreServicesCount] = useState<number | ''>('');

  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('');

  // Load Settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getCompanySettings();
        if (data) {
          setCompanyName(data.companyName || '');
          setCompanyTagline(data.companyTagline || '');
          setCompanyDescription(data.companyDescription || '');

          setPrimaryPhone(data.primaryPhone || '');
          setSecondaryPhone(data.secondaryPhone || '');
          setPrimaryEmail(data.primaryEmail || '');
          setSecondaryEmail(data.secondaryEmail || '');
          setWebsiteUrl(data.websiteUrl || '');

          setAddressLine1(data.addressLine1 || '');
          setAddressLine2(data.addressLine2 || '');
          setCity(data.city || '');
          setState(data.state || '');
          setCountry(data.country || '');
          setPostalCode(data.postalCode || '');
          setGoogleMapsUrl(data.googleMapsUrl || '');

          setPlacementAssistancePercentage(data.placementAssistancePercentage ?? 100);
          setCollegePartnersCount(data.collegePartnersCount ?? 0);
          setGraduatesTrainedCount(data.graduatesTrainedCount ?? 0);
          setStudentsTrainedCount(data.studentsTrainedCount ?? 0);
          setCoreServicesCount(data.coreServicesCount ?? 0);

          setLinkedinUrl(data.linkedinUrl || '');
          setInstagramUrl(data.instagramUrl || '');
          setFacebookUrl(data.facebookUrl || '');
          setYoutubeUrl(data.youtubeUrl || '');
          setWhatsappNumber(data.whatsappNumber || '');

          setHeroTitle(data.heroTitle || '');
          setHeroDescription(data.heroDescription || '');
          setHeroPrimaryCtaText(data.heroPrimaryCtaText || '');
          setHeroSecondaryCtaText(data.heroSecondaryCtaText || '');
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load company settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  // Dirty state warning on window leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved settings changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Partial<CompanySettings> = {
      companyName,
      companyTagline,
      companyDescription,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      websiteUrl,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      googleMapsUrl,
      placementAssistancePercentage: Number(placementAssistancePercentage),
      collegePartnersCount: Number(collegePartnersCount),
      graduatesTrainedCount: Number(graduatesTrainedCount),
      studentsTrainedCount: Number(studentsTrainedCount),
      coreServicesCount: Number(coreServicesCount),
      linkedinUrl,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      whatsappNumber,
      heroTitle,
      heroDescription,
      heroPrimaryCtaText,
      heroSecondaryCtaText
    };

    try {
      const result = await updateCompanySettings(payload);
      if (result) {
        toast('Company settings saved successfully!', 'success');
        setIsDirty(false);
      } else {
        toast('Failed to save settings.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="admin-title">Company Settings</h1>
          <p className="admin-subtitle">Manage global organization info, contact details, statistics, and homepage content</p>
        </div>
        {isDirty && (
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span> Unsaved changes
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1 - Company Info */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>business</span>
            <h3 style={{ margin: 0, color: '#001943', fontSize: '16px', fontWeight: 600 }}>Company Information</h3>
          </div>
          <div className="admin-form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              required
              value={companyName}
              onChange={e => handleFieldChange(setCompanyName, e.target.value)}
              placeholder="AgenticX Knowledge Solutions"
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div className="admin-form-group">
            <label>Company Tagline</label>
            <input 
              type="text" 
              value={companyTagline}
              onChange={e => handleFieldChange(setCompanyTagline, e.target.value)}
              placeholder="Bridging Education and Industry"
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label>Company Description / Profile</label>
            <textarea 
              value={companyDescription}
              onChange={e => handleFieldChange(setCompanyDescription, e.target.value)}
              placeholder="Brief description of the organization..."
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
            />
          </div>
        </div>

        {/* Section 2 - Contact Info */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>contact_phone</span>
            <h3 style={{ margin: 0, color: '#001943', fontSize: '16px', fontWeight: 600 }}>Contact Information</h3>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Primary Phone</label>
              <input 
                type="text" 
                value={primaryPhone}
                onChange={e => handleFieldChange(setPrimaryPhone, e.target.value)}
                placeholder="+91 9496552094"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group">
              <label>Secondary Phone</label>
              <input 
                type="text" 
                value={secondaryPhone}
                onChange={e => handleFieldChange(setSecondaryPhone, e.target.value)}
                placeholder="+91 9496852094"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Primary Email</label>
              <input 
                type="email" 
                value={primaryEmail}
                onChange={e => handleFieldChange(setPrimaryEmail, e.target.value)}
                placeholder="anju.muraleedharan@agenticx.co.in"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Secondary Email</label>
              <input 
                type="email" 
                value={secondaryEmail}
                onChange={e => handleFieldChange(setSecondaryEmail, e.target.value)}
                placeholder="agenticxknowledgesolutions@gmail.com"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <label>Website URL</label>
            <input 
              type="url" 
              value={websiteUrl}
              onChange={e => handleFieldChange(setWebsiteUrl, e.target.value)}
              placeholder="https://agenticx.co.in"
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        {/* Section 3 - Address */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>home_pin</span>
            <h3 style={{ margin: 0, color: '#001943', fontSize: '16px', fontWeight: 600 }}>Address Information</h3>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Address Line 1</label>
              <input 
                type="text" 
                value={addressLine1}
                onChange={e => handleFieldChange(setAddressLine1, e.target.value)}
                placeholder="3rd Floor, Raj Plaza"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group">
              <label>Address Line 2</label>
              <input 
                type="text" 
                value={addressLine2}
                onChange={e => handleFieldChange(setAddressLine2, e.target.value)}
                placeholder="Town Limit"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-row-four">
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <input 
                type="text" 
                value={city}
                onChange={e => handleFieldChange(setCity, e.target.value)}
                placeholder="Kollam"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>State</label>
              <input 
                type="text" 
                value={state}
                onChange={e => handleFieldChange(setState, e.target.value)}
                placeholder="Kerala"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Country</label>
              <input 
                type="text" 
                value={country}
                onChange={e => handleFieldChange(setCountry, e.target.value)}
                placeholder="India"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Postal Code</label>
              <input 
                type="text" 
                value={postalCode}
                onChange={e => handleFieldChange(setPostalCode, e.target.value)}
                placeholder="691001"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <label>Google Maps Iframe Embed URL</label>
            <input 
              type="text" 
              value={googleMapsUrl}
              onChange={e => handleFieldChange(setGoogleMapsUrl, e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
            />
            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>Make sure to paste only the direct source link from the Google Maps iframe src attribute.</small>
          </div>
        </div>

        {/* Section 4 - Statistics */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>equalizer</span>
            <h3 style={{ margin: 0, color: '#001943', fontSize: '16px', fontWeight: 600 }}>Homepage Statistics</h3>
          </div>
          <div className="admin-form-row-three" style={{ marginBottom: '16px' }}>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Placement Assistance (%)</label>
              <input 
                type="number" 
                required
                value={placementAssistancePercentage}
                onChange={e => handleFieldChange(setPlacementAssistancePercentage, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="100"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>College Partners Count</label>
              <input 
                type="number" 
                required
                value={collegePartnersCount}
                onChange={e => handleFieldChange(setCollegePartnersCount, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="20"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Graduates Trained Count</label>
              <input 
                type="number" 
                required
                value={graduatesTrainedCount}
                onChange={e => handleFieldChange(setGraduatesTrainedCount, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="250"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Students Trained Count</label>
              <input 
                type="number" 
                required
                value={studentsTrainedCount}
                onChange={e => handleFieldChange(setStudentsTrainedCount, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="100"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Core Services Count</label>
              <input 
                type="number" 
                required
                value={coreServicesCount}
                onChange={e => handleFieldChange(setCoreServicesCount, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>

        {/* Section 5 - Social Links */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>share</span>
            <h3 style={{ margin: 0, color: '#001943', fontSize: '16px', fontWeight: 600 }}>Social Media & Links</h3>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>LinkedIn Profile URL</label>
              <input 
                type="url" 
                value={linkedinUrl}
                onChange={e => handleFieldChange(setLinkedinUrl, e.target.value)}
                placeholder="https://linkedin.com/company/agenticx"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group">
              <label>Instagram URL</label>
              <input 
                type="url" 
                value={instagramUrl}
                onChange={e => handleFieldChange(setInstagramUrl, e.target.value)}
                placeholder="https://instagram.com/agenticx"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Facebook URL</label>
              <input 
                type="url" 
                value={facebookUrl}
                onChange={e => handleFieldChange(setFacebookUrl, e.target.value)}
                placeholder="https://facebook.com/agenticx"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>YouTube Channel URL</label>
              <input 
                type="url" 
                value={youtubeUrl}
                onChange={e => handleFieldChange(setYoutubeUrl, e.target.value)}
                placeholder="https://youtube.com/agenticx"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div className="admin-form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <label>WhatsApp Contact Number (with country code)</label>
            <input 
              type="text" 
              value={whatsappNumber}
              onChange={e => handleFieldChange(setWhatsappNumber, e.target.value)}
              placeholder="+919496552094"
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        {/* Section 6 - Homepage Hero Content */}
        <div className="admin-kpi-card glass-panel" style={{ display: 'block', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
            <span className="material-symbols-outlined" style={{ color: '#2563eb' }}>web</span>
            <h3 style={{ margin: 0, color: '#001943', fontSize: '16px', fontWeight: 600 }}>Homepage Content</h3>
          </div>
          <div className="admin-form-group">
            <label>Hero Section Title</label>
            <input 
              type="text" 
              value={heroTitle}
              onChange={e => handleFieldChange(setHeroTitle, e.target.value)}
              placeholder="Decode Data. Develop Systems. Drive Business."
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div className="admin-form-group">
            <label>Hero Description</label>
            <textarea 
              value={heroDescription}
              onChange={e => handleFieldChange(setHeroDescription, e.target.value)}
              placeholder="Brief tagline description for the hero segment..."
              style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1', width: '100%', minHeight: '80px', borderRadius: '8px', padding: '10px', outline: 'none' }}
            />
          </div>
          <div className="admin-form-row" style={{ marginBottom: 0 }}>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Primary Button (CTA) Text</label>
              <input 
                type="text" 
                value={heroPrimaryCtaText}
                onChange={e => handleFieldChange(setHeroPrimaryCtaText, e.target.value)}
                placeholder="Explore Courses"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Secondary Button (CTA) Text</label>
              <input 
                type="text" 
                value={heroSecondaryCtaText}
                onChange={e => handleFieldChange(setHeroSecondaryCtaText, e.target.value)}
                placeholder="Book Free Demo"
                style={{ background: '#f8fafc', color: '#001943', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button 
            type="submit" 
            disabled={saving || !isDirty} 
            className="activity-book-btn" 
            style={{ borderRadius: '8px', padding: '12px 30px', opacity: saving || !isDirty ? 0.7 : 1, cursor: saving || !isDirty ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px' }}
          >
            {saving && <div className="admin-loading-spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />}
            {saving ? 'Saving Settings...' : 'Save Configuration'}
          </button>
        </div>

      </form>
    </div>
  );
}
