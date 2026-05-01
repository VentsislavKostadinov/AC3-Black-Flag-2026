import { routes } from '../routes.js';

const navLinks = document.getElementById('navLinks');
const app = document.getElementById('app');

// function to create new nav items
const renderNavLinks = () => {
    const navFragment = document.createDocumentFragment();
    Object.keys(routes).forEach((route) => {
        const { linkLabel } = routes[route];

        const navItem = document.createElement('li');
        navItem.className = 'nav-item';

        const linkElement = document.createElement('a');
        linkElement.href = `#${route}`;
        linkElement.textContent = linkLabel;
        linkElement.className = 'nav-link';
        linkElement.setAttribute('data-route', route);

        navItem.appendChild(linkElement);
        navFragment.appendChild(navItem);
    });

    navLinks.innerHTML = '';
    navLinks.append(navFragment);
};

const updateActiveNavLink = (route) => {
    navLinks.querySelectorAll('.nav-link').forEach((linkElement) => {
        const isActive = linkElement.getAttribute('data-route') === route;
        linkElement.classList.toggle('active', isActive);
        linkElement.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
};

const getCurrentRoute = () => {
    const hashRoute = location.hash.replace(/^#/, '');
    if (!hashRoute) return '/';
    return hashRoute.startsWith('/') ? hashRoute : `/${hashRoute}`;
};

const getExternalPageContent = async (path) => {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load page content from ${path}`);
    }

    return response.text();
};

const renderContent = async route => {
    const safeRoute = routes[route] ? route : '/';
    const routeConfig = routes[safeRoute];
    updateActiveNavLink(safeRoute);

    if (routeConfig.contentFile) {
        try {
            app.innerHTML = await getExternalPageContent(routeConfig.contentFile);
            return;
        } catch (error) {
            app.innerHTML = `
                <section>
                    <h1>Page Load Error</h1>
                    <p>Unable to load this page right now.</p>
                </section>
            `;
            return;
        }
    }

    app.innerHTML = routeConfig.content;
};

const registerBrowserBackAndForth = () => {
    window.addEventListener('hashchange', () => {
        void renderContent(getCurrentRoute());
    });
};

const renderInitialPage = () => {
    const route = getCurrentRoute();
    void renderContent(route);
};

(function bootup() {
    renderNavLinks();
    registerBrowserBackAndForth();
    renderInitialPage();
})();

