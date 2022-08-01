import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Field } from 'nexus/forms/field/Field';

import { Row } from 'nexus/layout/row/Row';

import { Helper } from 'nexus/ui/helper/Helper';
import { Popup } from 'nexus/ui/popup/Popup';
import { Button } from 'nexus/ui/button/Button';

import './PopupEditPlateform.css';


// Models
// ======================================================================================================

// ***** PopupEditPlateformStore *****
// ***********************************

const TAG_PopupEditPlateformStore = () => {}
export const PopupEditPlateformStore = types
	.model({
		plateformId: types.maybeNull(types.string),
	})
	.views(self => ({

		get plateform() {
			const store = getRoot(self);
			const plateforms = store.plateforms;
			if (self.plateformId) {
				return plateforms.by_id.get(self.plateformId);
			} else {
				return plateforms.draft;
			}
		},

		get baseSavePath() {
			if (self.plateformId) {
				return ['plateforms', 'by_id', self.plateformId];
			} else {
				return ['plateforms', 'draft'];
			}
		},

		// Bools
		// -

		get isOpen() {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			return popup.isOpen(popupEditPlateformKey);
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		// -

		open: () => {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			popup.open(popupEditPlateformKey);
		},

		close: () => {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			popup.close(popupEditPlateformKey);
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** PopupEditPlateform *****
// ******************************

const TAG_PopupEditPlateform = () => {}
export const popupEditPlateformKey = 'popupEditPlateform';
export const PopupEditPlateform = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const popup = app.popup;
	const popupEditPlateform = store.popupEditPlateform;

	// From ... store

	const isLoading = app.isLoading;
	const isOpen = popupEditPlateform.isOpen;

	// ...

	const plateformId = popupEditPlateform.plateformId;
	const plateform = popupEditPlateform.plateform;

	// Events
	// ==================================================================================================

	const handleBtnCancel = () => {
		popupEditPlateform.close();
	}

	const handleBtnValidate = () => {
		// TODO
	}

	// Render
	// ==================================================================================================

	// Popup --> Title
	// -----------------------------------------------

	let popupTitle = (plateformId) ? "Modification support" : "Nouveau support";

	// Popup --> Content
	// -----------------------------------------------

	let popupContent = null;
	if (isOpen) {
		if (plateform) {
			popupContent = (
				<div></div>
			)
		} else {
			popupContent = (
				<Helper
					iconName="memory"
					show={true}
					inFlux={true}
					style={{
						minHeight: '600px',
					}}
				/>
			)
		}
	}

	// Popup --> Buttons
	// -----------------------------------------------

	let popupButtons = [];

	popupButtons.push(
		<Button
			key="btn-edit-support-cancel"
			disabled={isLoading}
			onClick={() => handleBtnCancel()}
		>
			Annuler
		</Button>
	)

	popupButtons.push(
		<Button
			key="btn-edit-support-validate"
			disabled={isLoading}
			color="primary"
			onClick={() => handleBtnValidate()}
		>
			{(plateformId) ? "Modifier" : "Créer"}
		</Button>
	)

	// -----------------------------------------------

	return (
		<Popup
			id={popupEditPlateformKey}
			title={popupTitle}
			// maxWidth="md"
			buttons={popupButtons}
		>
			{popupContent}
		</Popup>
	)
})
