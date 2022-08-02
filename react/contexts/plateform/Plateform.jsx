import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { ImageStore } from 'nexus/forms/image/Image';

import { Helper } from 'nexus/ui/helper/Helper';
import { HeaderTitle } from 'nexus/layout/header/Header';
import { MenuItem } from 'nexus/layout/menu/Menu';

import './Plateform.css';


// Models
// ======================================================================================================

// ***** PlateformStore *****
// **************************

const TAG_PlateformStore = () => {}
export const PlateformStore = types
	.model({
		id: types.maybeNull(types.string),
		name: types.maybeNull(types.string),
		nickname: types.maybeNull(types.string),
		logo: types.optional(ImageStore, {}),
		cover_shape: types.maybeNull(types.string), // vertical, horizontal, square

		game_ids: types.optional(types.array(types.string), []),
	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** PlateformHeaderLeft *****
// *******************************

const TAG_PlateformHeaderLeft = () => {}
export const PlateformHeaderLeft = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return (
		<HeaderTitle
			title="Plateforme"
			titleStyle={{
				marginLeft: '10px',
			}}
		/>
	)
})

// ***** PlateformHeaderRight *****
// ********************************

const TAG_PlateformHeaderRight = () => {}
export const PlateformHeaderRight = observer((props) => {

	// const store = React.useContext(window.storeContext);
	// const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return null;
})

// ***** PlateformPage *****
// *************************

const TAG_PlateformPage = () => {}
export const PlateformPage = observer((props) => {

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
