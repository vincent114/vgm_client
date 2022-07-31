import React from 'react';
import ReactDOM from 'react-dom';
import { types } from "mobx-state-tree";
import { observer } from "mobx-react-lite";

import { NxAppStore, NxApp, makeInitSnapshot } from 'nexus/NxApp';

import { STATIC_SMAP } from 'nexus/models/services';
import { copyObj } from 'nexus/utils/Datas';
import { getFromStorage, setToStorage } from 'nexus/utils/Storage';

import { ContextualHeader } from 'vgm_client/ui/ContextualHeader';
import { ContextualMenu } from 'vgm_client/ui/ContextualMenu';
import { HomePage } from 'vgm_client/contexts/home/Home';
import { SearchStore, SearchPage } from 'vgm_client/contexts/search/Search';
import { BrandsStore, BrandsPage } from 'vgm_client/contexts/brands/Brands';
import { BrandPage } from 'vgm_client/contexts/brand/Brand';
import { PlateformsStore } from 'vgm_client/models/Plateforms';
import { PlateformPage } from 'vgm_client/contexts/plateform/Plateform';
import { GamesStore } from 'vgm_client/models/Games';
import { AdminPage } from 'vgm_client/contexts/admin/Admin';

import { LibraryStore } from 'vgm_client/models/Library';

import './Main.css';


// Models
// ======================================================================================================

// ***** RootStore *****
// *********************

const TAG_RootStore = () => {}
const RootStore = types
	.model({
		app: types.optional(NxAppStore, {}),

		// Search
		// -

		search: types.optional(SearchStore, {}),

		// Ludothèque
		// -

		brands: types.optional(BrandsStore, {}),
		brandId: types.maybeNull(types.string),

		plateforms: types.optional(PlateformsStore, {}),
		plateformId: types.maybeNull(types.string),

		games: types.optional(GamesStore, {}),

		// -

		library: types.optional(LibraryStore, {}),

		// -

		loaded: false,

	})
	.actions(self => ({

		afterLoad: () => {

			// La bibliothèque est-elle entièrement chargée ?
			// ---

			const app = self.app;

			if (!self.library.loaded) { return; }

			if (!self.brands.loaded) { return; }
			if (!self.plateforms.loaded) { return; }
			if (!self.games.loaded) { return; }

			self.loaded = true;
			app.removeTask('load_library');

			// A l'écoute des commandes en provenance des menus de l'OS
			// -

			ipc.on('about', (datas) => {
				app.navigateTo('about');
			});
			ipc.on('admin', (datas) => {
				app.navigateTo('admin');
			});
		},

		update: (datas) => {

			// VGM-specific init datas
			// ---

			self.library.load();

			setTimeout(() => {
				self.brands.load(self.afterLoad);
				self.plateforms.load(self.afterLoad);
				self.games.load(self.afterLoad);
			}, 250);
		},

		navigateTo: (navContext, contextId, contextUrl, contextExtras, callback) => {

			// VGM own navigation function
			// ---

			const app = self.app;
			const context = app.context;

			// -

			// Brands
			if (navContext == 'brands') {
				app.navigate('/main.html', 'brands');
			}
			if (navContext == 'brand') {
				setToStorage('lastBrandId', contextId);
				app.navigate('/main.html', 'brand', [
					{"op": "replace", "path": "/brandId", "value": contextId},
				]);
			}

			// Plateform
			if (navContext == 'plateform') {
				setToStorage('lastPlateformId', contextId);
				app.navigate('/main.html', 'plateform', [
					{"op": "replace", "path": "/plateformId", "value": contextId},
				]);
			}
		},

	}))


// Init
// ======================================================================================================

// Contexts
// -

let contexts = {
	'home': HomePage,
	'search': SearchPage,

	'brands': BrandsPage,
	'brand': BrandPage,

	'plateform': PlateformPage,

	'admin': AdminPage,
}

// Popups
// -

let popups = {}

// Routes
// -

let routes = {
	'home': '/main.html',

	'brands': '/brands',
	'brand:brandId': '/brand/:brandId',

	'plateform:plateformId': '/plateform/:plateformId',
}

// Store
// -

let initSnapshot = makeInitSnapshot(routes, {
	'app': {
		'context': getFromStorage("lastContext", "home"),
		'kind': 'electron',
		'platform': ipc.sendSync('platform'),
		// 'tasks': ['load_library'],
		'header': {
			'dynamic': false,
		},
		'menu': {
			'pinned': false,
		},
		'theme': {
			'palette_light': {
				'primary': {
					'main': '#3f51b5',
				},
				'secondary': {
					'main': '#607d8b',
				},
			},
			'palette_dark': {
				'primary': {
					'main': '#3f51b5',
				},
				'secondary': {
					'main': '#607d8b',
				},
			}
		},
		'brandId': getFromStorage('lastBrandId', ''),
		'plateformId': getFromStorage('lastPlateformId', ''),
	}
});

export const rootStore = RootStore.create(initSnapshot);
export const RootStoreContext = React.createContext(rootStore);

window.store = rootStore;
window.storeContext = RootStoreContext;

setToStorage('debugMode', true, 'bool');

let staticRaw = {
	'smap': copyObj(STATIC_SMAP),
}
staticRaw['smap']['me'] = copyObj(STATIC_SMAP['vgm']);

rootStore.app.init(
	(datas) => {
		rootStore.update(datas);
	},
	popups,
	{},
	staticRaw
);


// Functions Components ReactJS
// ======================================================================================================

// ***** Root *****
// ****************

const TAG_Root = () => {}
const Root = observer(() => {

	// Render
	// ==================================================================================================

	return (
		<RootStoreContext.Provider value={rootStore}>
			<NxApp
				header={ContextualHeader}
				menu={ContextualMenu}
				contexts={contexts}
				popups={popups}
			/>
		</RootStoreContext.Provider>
	)
})


// DOM Ready
// ======================================================================================================

window.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Root></Root>,
		document.getElementById("nx-root")
	);
});
