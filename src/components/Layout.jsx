import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../config/routes';
import LanguageSelector from './LanguageSelector';
import Footer from './Footer';

const Layout = ({ complexityMode, setComplexityMode }) => {
    const { t } = useTranslation();

    return (
        <div className="container">
            {/* Header / Navigation */}
            <nav className="main-nav">
                {ROUTES.filter(r => r.showInNav).map(route => (
                    <NavLink
                        key={route.key}
                        to={route.path}
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        {t(`nav.${route.key}`, { defaultValue: route.key.charAt(0).toUpperCase() + route.key.slice(1) })}
                    </NavLink>
                ))}
            </nav>

            <LanguageSelector
                complexityMode={complexityMode}
                setComplexityMode={setComplexityMode}
            />

            <main style={{ minHeight: '60vh' }}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
