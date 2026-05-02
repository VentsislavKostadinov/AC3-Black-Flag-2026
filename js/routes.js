import { renderHomePage } from './pages/home.js';
import { renderHistoryPage } from './pages/history.js';


export const routes = {
    '/': {
        linkLabel: 'Home',
        render: renderHomePage
    },
    '/history': {
        linkLabel: 'History',
        render: renderHistoryPage
    },
};