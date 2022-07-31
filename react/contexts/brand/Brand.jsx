import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Helper } from 'nexus/ui/helper/Helper';
import { HeaderTitle } from 'nexus/layout/header/Header';
import { MenuItem } from 'nexus/layout/menu/Menu';

import './Brand.css';


// Models
// ======================================================================================================

// ***** BrandStore *****
// **********************

const TAG_BrandStore = () => {}
export const BrandStore = types
	.model({

	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** BrandHeaderLeft *****
// ***************************

const TAG_BrandsHeaderLeft = () => {}
export const BrandHeaderLeft = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return (
		<HeaderTitle
			title="Marque"
		/>
	)
})

// ***** BrandHeaderRight *****
// ****************************

const TAG_BrandHeaderRight = () => {}
export const BrandHeaderRight = observer((props) => {

	// const store = React.useContext(window.storeContext);
	// const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return null;
})

// ***** BrandPage *****
// *********************

const TAG_BrandPage = () => {}
export const BrandPage = observer((props) => {

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
