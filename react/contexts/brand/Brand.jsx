import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { ImageStore } from 'nexus/forms/image/Image';

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
		id: types.maybeNull(types.string),
		name: types.maybeNull(types.string),
		logo: types.optional(ImageStore, {}),

		idx: types.maybeNull(types.integer),

		plateform_ids: types.optional(types.array(types.string), []),
	})
	.views(self => ({

		get nbPlateforms() {
			return self.plateform_ids.length;
		},

		get subtitle() {
			const nbPlateforms = self.nbPlateforms;
			return `${nbPlateforms} ${(nbPlateforms > 1) ? "plateformes" : "plateforme"}`
		},

		// -

		get plateforms() {
			const store = getRoot(self);
			const plateforms = store.plateforms;

			let plateformsList = [];
			for (const plateformId of self.plateform_ids) {
				const plateform = plateforms.by_id.get(plateformId);
				if (plateform) {
					plateformsList.push(plateform);
				}
			}
			plateformsList.sort(function (a, b) {
				if (a.name > b.name)
					return 1;
				if (a.name < b.name)
					return -1;
				return 0;
			});
			return plateformsList;
		},

	}))
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
			titleStyle={{
				marginLeft: '10px',
			}}
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
