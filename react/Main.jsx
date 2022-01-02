import React from 'react';
import ReactDOM from 'react-dom';
import { types } from "mobx-state-tree";
import { observer } from "mobx-react-lite";

import { NxAppStore, NxApp, makeInitSnapshot } from 'nexus/NxApp';

import { ContextualHeader } from 'vgm_client/ui/ContextualHeader';
import { ContextualMenu } from 'vgm_client/ui/ContextualMenu';
import { HomePage } from 'vgm_client/contexts/home/Home';
import { SearchStore, SearchPage } from 'vgm_client/contexts/search/Search';
import { CollectionStore, CollectionPage } from 'vgm_client/contexts/collection/Collection';
import { AdminPage } from 'vgm_client/contexts/admin/Admin';

import './Main.css';


// Models
// -------------------------------------------------------------------------------------------------------------

// ***** RootStore *****
// *********************

const TAG_RootStore = () => {}
const RootStore = types
	.model({
		'app': types.optional(NxAppStore, {}),

		// Search
		// -

		'search': types.optional(SearchStore, {}),

		// Ludothèque
		// -

		'collection': types.optional(CollectionStore, {}),

	})
	.actions(self => ({

		update: (datas) => {

			// VGM-specific init datas
			// ---

			console.log(datas);
		},

		navigateTo: (navContext, contextId, contextUrl, contextExtras, callback) => {

			// VGM own navigation function
			// ---

			const app = self.app;
			const context = app.context;

			// -

			// Search
			if (navContext == 'search') {
				app.navigate('/main.html', 'search');
			}

			// -

			// Ludothèque
			if (navContext == 'collection') {
				app.navigate('/collection', 'collection', [
					{"op": "replace", "path": "/collection/loaded", "value": false},
				]);
			}

		},

	}))


// Init
// -------------------------------------------------------------------------------------------------------------

// Contexts
// -

let contexts = {
	'home': HomePage,
	'search': SearchPage,
	'collection': CollectionPage,
	'admin': AdminPage,
}

// Popups
// -

let popups = {}

// Routes
// -

let routes = {
	'home': '/main.html',
	'search': '/search',
	'collection': '/collection',
	'admin': '/admin',
}

// Store
// -

let initSnapshot = makeInitSnapshot(routes, {
	'app': {
		'context': 'home', // TODO : Last context ?
		'kind': 'electron',
		'theme': {
			'variant': 'light',
			'palette': {
				'default': {
					'main': '#000000',
					'contrastText': '#fff',
				},
				'primary': {
					'main': '#3f51b5',
					'contrastText': '#fff',
				},
				'secondary': {
					'main': '#607d8b',
					'contrastText': '#fff',
				},
			}
		}
	}
});

export const rootStore = RootStore.create(initSnapshot);
export const RootStoreContext = React.createContext(rootStore);

window.store = rootStore;
window.storeContext = RootStoreContext;

rootStore.app.init(
	(datas) => {
		rootStore.update(datas);
	},
	popups,
	{}
);


// Functions Components ReactJS
// -------------------------------------------------------------------------------------------------------------

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
// --------------------------------------------------------------------------------------------------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Root></Root>,
		document.getElementById("nx-root")
	);
});
