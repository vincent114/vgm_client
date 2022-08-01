import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { BrandStore } from 'vgm_client/contexts/brand/Brand';

import { HeaderTitle } from 'nexus/layout/header/Header';
import { MenuItem } from 'nexus/layout/menu/Menu';

import { Helper } from 'nexus/ui/helper/Helper';
import { IconButton } from 'nexus/ui/button/Button';

import './Brands.css';


// Models
// ======================================================================================================

// ***** BrandsStore *****
// ***********************

const TAG_BrandsStore = () => {}
export const BrandsStore = types
	.model({
		by_id: types.map(BrandStore),

		draft: types.optional(BrandStore, {}),

		loaded: false,
	})
	.views(self => ({

		get collectionFilePath() {
			const store = getRoot(self);
			const library = store.library;
			const path = ipc.sendSync('pathJoin', [library.collectionPath, 'brands.json']);
			return path;
		},

		get filesFolderPath() {
			const store = getRoot(self);
			const library = store.library;
			const path = ipc.sendSync('pathJoin', [library.collectionFilesPath, 'brands']);
			return path;
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		setBrand: (brand) => {
			self.by_id.set(brand.id, BrandStore.create(brand.toJSON()));
		},

		// -

		load: (callback) => {

			// Chargement des marques
			// ---

			const store = getRoot(self);
			const app = store.app;

			app.readJsonFile(
				self.collectionFilePath,
				{
					by_id: {},
				},
				(raw) => {
					app.saveValue(['brands', 'by_id'], raw.by_id, () => {
						self.setField('loaded', true);
						if (callback) {
							callback();
						}
					});
				},
				app.debugMode,
			);
		},

		save: (callback) => {

			// Sauvegarde des marques
			// ---

			const store = getRoot(self);
			const app = store.app;
			app.writeJsonFile(self.collectionFilePath, self.toJSON());

			if (callback) {
				callback();
			}
		},

		createNew: () => {

			// Création d'une nouvelle marque
			// ---

			const store = getRoot(self);
			const app = store.app;
			const helpers = app.helpers;
			const popupEditBrand = store.popupEditBrand;

			self.draft = BrandStore.create({
				'id': helpers.generateUUID(),
				'idx': 0,
			});
			popupEditBrand.setField('brandId', '');
			popupEditBrand.open();
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** BrandsHeaderLeft *****
// ****************************

const TAG_BrandsHeaderLeft = () => {}
export const BrandsHeaderLeft = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return (
		<HeaderTitle
			title="Marques"
			titleStyle={{
				marginLeft: '10px',
			}}
		/>
	)
})

// ***** BrandsHeaderRight *****
// *****************************

const TAG_BrandsHeaderRight = () => {}
export const BrandsHeaderRight = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const brands = store.brands;

	// ...

	// Events
	// ==================================================================================================

	const handleAddBrand = () => {
		brands.createNew();
	}

	// Render
	// ==================================================================================================

	return (
		<React.Fragment>
			<IconButton
				iconName="add"
				color="#FFFFFF"
				onClick={handleAddBrand}
			/>
		</React.Fragment>
	)
})

// ***** BrandsMenuItem *****
// **************************

const TAG_BrandsMenuItem = () => {}
export const BrandsMenuItem = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const menu = app.menu;

	// ...

	const brandsContext = 'brands';

	// Events
	// ==================================================================================================

	const handleMenuItemClick = () => {
		store.navigateTo(brandsContext);
		app.menu.close();
	}

	// Render
	// ==================================================================================================

	return (
		<MenuItem
			iconName="sports_esports"
			label="Ludothèque"
			activeContexts={[brandsContext]}
			callbackClick={handleMenuItemClick}
		/>
	)
})

// ***** BrandsPage *****
// **********************

const TAG_BrandsPage = () => {}
export const BrandsPage = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// Renderers
	// ==================================================================================================

	const renderHelper = () => {

		// Render :: Helper
		// ---

		return (
			<Helper
				iconName="sports_esports"
				show={true}
			/>
		)
	}

	return (
		<div className="nx-page">
			{renderHelper()}
		</div>
	)
})
