import { renderHomePage } from './pages/home.js';
import { renderHistoryPage } from './pages/history.js';
import { renderCharactersPage } from './pages/characters.js';
import { renderCitiesPage } from './pages/cities.js';
import { renderTrailersPage } from './pages/trailers.js';


export const routes = {
    '/': {
        linkLabel: 'Home',
        render: renderHomePage
    },
    '/history': {
        linkLabel: 'History',
        render: renderHistoryPage
    },
    '/characters': {
        linkLabel: 'Characters',
        render: renderCharactersPage,
        dropdownKey: 'characters',
        dropdownItemLabelKey: 'character'
    },
    '/cities': {
        linkLabel: 'Cities',
        render: renderCitiesPage,
        dropdownKey: 'cities',
        dropdownItemLabelKey: 'city'
    },
    '/trailers': {
        linkLabel: 'Trailers',
        render: renderTrailersPage
    },
};