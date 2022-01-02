import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Helper } from 'nexus/ui/helper/Helper';
import { HeaderTitle } from 'nexus/layout/header/Header';
import { MenuItem } from 'nexus/layout/menu/Menu';
import { Icon } from 'nexus/ui/icon/Icon';

import './Collection.css';


// Models
// -------------------------------------------------------------------------------------------------------------

// ***** CollectionStore *****
// ***************************

const TAG_CollectionStore = () => {}
export const CollectionStore = types
	.model({
		loaded: false,
	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		// -

		update: (raw) => {

		},

	}))


// Functions Components ReactJS
// -------------------------------------------------------------------------------------------------------------

// ***** CollectionHeaderLeft *****
// ********************************

const TAG_CollectionHeaderLeft = () => {}
export const CollectionHeaderLeft = observer((props) => {

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

// ***** CollectionMenuItem *****
// ******************************

const TAG_CollectionMenuItem = () => {}
export const CollectionMenuItem = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const menu = app.menu;

	// ...

	const collectionContext = 'collection';

	// Evènements
	// ==================================================================================================

	const handleMenuItemClick = () => {
		store.navigateTo(collectionContext);
		app.menu.close();
	}

	// Render
	// ==================================================================================================

	return (
		<MenuItem
			icon={<Icon name="sports_esports" width="120px" />}
			label="Ludothèque"
			activeContexts={[collectionContext]}
			callbackClick={handleMenuItemClick}
		/>
	)
})

// ***** CollectionPage *****
// **************************

const TAG_CollectionPage = () => {}
export const CollectionPage = observer((props) => {

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
