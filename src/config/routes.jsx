import Teachings from '../pages/Teachings';
import Home from '../pages/Home';

export const ROUTES = [
    {
        path: "/",
        key: "home", // Used for I18N: nav.home
        element: <Home />,
        showInNav: true
    },

    {
        path: "/teachings",
        key: "teachings",
        element: <Teachings />,
        showInNav: true
    },
];