import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer style={{
            marginTop: '4rem',
            padding: '2rem 1rem',
            borderTop: '1px solid var(--glass-border, rgba(255,255,255,0.1))',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.6)'
        }}>
            <p>&copy; {year} {t('title')}. {t('footer.rights', 'All Rights Reserved.')}</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footer.contact', 'Contact')}</a>
                <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footer.privacy', 'Privacy')}</a>
            </div>
        </footer>
    );
};

export default Footer;
