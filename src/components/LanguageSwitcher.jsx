import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const languages = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fon', flag: '🇧🇯', name: 'Fon' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    localStorage.setItem('preferred_language', code);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {currentLang.flag} {currentLang.name} ▼
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '5px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          zIndex: 1000
        }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                width: '100%',
                padding: '10px 20px',
                border: 'none',
                background: i18n.language === lang.code ? '#f0f0f0' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left'
              }}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}