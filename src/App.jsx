import { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import './App.css';

import { ROUTES } from './config/routes';

function App() {
    // Lifted state for complexity mode to App level (though Layout handles UI)
    // We pass it to Layout so the LanguageSelector inside it can control it.
    // AND we use it here to ensure the i18n instance is reactive if needed, 
    // although useTranslation hook inside components handles it mostly.
    const [complexityMode, setComplexityMode] = useState('translation');
    const { i18n } = useTranslation();

    // Force global default namespace change so deep components pick it up
    if (i18n.options.defaultNS !== complexityMode) {
        i18n.setDefaultNamespace(complexityMode);
    }

    return (
        <HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <Layout
                            complexityMode={complexityMode}
                            setComplexityMode={setComplexityMode}
                        />
                    }>
                        {ROUTES.map(route => (
                            <Route key={route.key} path={route.path} element={route.element} index={route.path === '/'} />
                        ))}
                    </Route>
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
