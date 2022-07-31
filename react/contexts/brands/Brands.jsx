import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { BrandStore } from 'vgm_client/contexts/brand/Brand';

import { Helper } from 'nexus/ui/helper/Helper';
import { HeaderTitle } from 'nexus/layout/header/Header';
import { MenuItem } from 'nexus/layout/menu/Menu';

import './Brands.css';


// Models
// ======================================================================================================

// ***** BrandsStore *****
// ***********************

const TAG_BrandsStore = () => {}
export const BrandsStore = types
	.model({
		by_id: types.map(BrandStore),

		loaded: false,
	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
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
			title="Ludothèque"
		/>
	)
})

// ***** BrandsHeaderRight *****
// *****************************

const TAG_BrandsHeaderRight = () => {}
export const BrandsHeaderRight = observer((props) => {

	// const store = React.useContext(window.storeContext);
	// const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return null;
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
