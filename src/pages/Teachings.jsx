import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';
import MediaContainer from '../components/common/MediaContainer';

function Teachings() {
    const { t } = useTranslation();
    const key = 'teachings';

    return (
        <div className="teachings-container">
            <PageHeader 
                title={t(`${key}.title`)} 
                subtitle={t(`${key}.subtitle`)} 
            />
            
            <div className="content-block" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <p>{t(`${key}.description`)}</p>
                
                {/* Example Media 
                <MediaContainer 
                    type="youtube"
                    src="https://www.youtube.com/embed/..."
                    caption="Sample Video"
                />
                */}
            </div>
        </div>
    );
}

export default Teachings;
