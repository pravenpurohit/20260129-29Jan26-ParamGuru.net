import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/LanguageSelector';
import './App.css'

function App() {
    const { t } = useTranslation();

    return (
        <>
            <div className="container">
                <LanguageSelector />
                <h1>{t('title')}</h1>
                <div className="photo-gallery">
                    <div className="photo-card">
                        <img
                            src="/assets/2017_Pitaji_Photo_Final_NoLayers_24x36_300dpi_DateCorrected.jpg"
                            alt="Pitaji Photo"
                        />
                    </div>
                    <div className="photo-card">
                        <img
                            src="/assets/PapajiPrasad_2017_12x18_600dpi.jpg"
                            alt="Papaji Prasad Photo"
                        />
                    </div>
                </div>
                <p>{t('welcome')}</p>
                <p>{t('instruction')}</p>
            </div>
        </>
    )
}

export default App
