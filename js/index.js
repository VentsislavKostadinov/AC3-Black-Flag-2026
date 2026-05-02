import { routes } from './routes.js';
import { initStore, getStore } from './store.js';

const navLinks = document.getElementById('navLinks');
const app = document.getElementById('app');

// function to create new nav items
const renderNavLinks = () => {
    const store = getStore();
    const navigationData = store.navigation ?? [];
    const navFragment = document.createDocumentFragment();

    const getDropdownItems = (dropdownKey) => {
        const section = navigationData.find((item) => item[dropdownKey]);
        return section?.[dropdownKey] ?? [];
    };

    const createBaseLink = (route, linkLabel, className = 'nav-link') => {
        const linkElement = document.createElement('a');
        linkElement.href = `#${route}`;
        linkElement.textContent = linkLabel;
        linkElement.className = className;
        linkElement.setAttribute('data-route', route);
        return linkElement;
    };

    Object.keys(routes).forEach((route) => {
        const { linkLabel, dropdownKey, dropdownItemLabelKey } = routes[route];

        const navItem = document.createElement('li');
        navItem.className = 'nav-item';

        if (dropdownKey && dropdownItemLabelKey) {
            navItem.classList.add('dropdown');

            const toggleLink = createBaseLink(route, linkLabel, 'nav-link dropdown-toggle');
            toggleLink.setAttribute('role', 'button');
            toggleLink.setAttribute('data-bs-toggle', 'dropdown');
            toggleLink.setAttribute('aria-expanded', 'false');

            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';

            const dropdownItems = getDropdownItems(dropdownKey);
            dropdownItems.forEach((item) => {
                const label = item[dropdownItemLabelKey];
                if (!label) {
                    return;
                }

                const menuItem = document.createElement('li');
                const menuLink = createBaseLink(route, label, 'dropdown-item');

                if (route === '/characters' || route === '/cities') {
                    menuLink.href = `#${route}?selected=${encodeURIComponent(label)}`;
                }

                menuItem.appendChild(menuLink);
                dropdownMenu.appendChild(menuItem);
            });

            navItem.appendChild(toggleLink);
            navItem.appendChild(dropdownMenu);
            navFragment.appendChild(navItem);
            return;
        }

        const linkElement = createBaseLink(route, linkLabel);

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
    const [routePath] = hashRoute.split('?');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
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

    if (routeConfig.render) {
        app.innerHTML = routeConfig.render();
        return;
    }

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

const bootup = async () => {
    try {
        await initStore();

        renderNavLinks();
        registerBrowserBackAndForth();
        renderInitialPage();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
};

void bootup();

