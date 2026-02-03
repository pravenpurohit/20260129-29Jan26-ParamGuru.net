import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';
import MediaContainer from '../components/common/MediaContainer';

function Home() {
    const { t } = useTranslation();

    return (
        <div className="home-container">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <div className="photo-gallery" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
                    <MediaContainer
                        type="image"
                        src="/assets/2017_Pitaji_Photo_Final_NoLayers_24x36_300dpi_DateCorrected.jpg"
                        alt="Pitaji Photo"
                    />
                </div>
                <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
                    <MediaContainer
                        type="image"
                        src="/assets/PapajiPrasad_2017_12x18_600dpi.jpg"
                        alt="Papaji Prasad Photo"
                    />
                </div>
            </div>

            <div className="content-block" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <p>{t('welcome')}</p>
                <p>{t('instruction')}</p>
            </div>
        </div>
    );
}

export default Home;
