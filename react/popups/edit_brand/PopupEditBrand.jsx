import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Field } from 'nexus/forms/field/Field';
import { ImageDropzone } from 'nexus/forms/image/Image';

import { Row } from 'nexus/layout/row/Row';

import { Helper } from 'nexus/ui/helper/Helper';
import { Popup } from 'nexus/ui/popup/Popup';
import { Button } from 'nexus/ui/button/Button';

import { extendArray } from 'nexus/utils/Datas';
import { sanitizeString } from 'nexus/utils/Helpers';

import './PopupEditBrand.css';


// Models
// ======================================================================================================

// ***** PopupEditBrandStore *****
// *******************************

const TAG_PopupEditBrandStore = () => {}
export const PopupEditBrandStore = types
	.model({
		brandId: types.maybeNull(types.string),
	})
	.views(self => ({

		get brand() {
			const store = getRoot(self);
			const brands = store.brands;
			// if (self.brandId) {
			// 	return brands.by_id.get(self.brandId);
			// } else {
			// 	return brands.draft;
			// }
			return brands.draft;
		},

		get baseSavePath() {
			// if (self.brandId) {
			// 	return ['brands', 'by_id', self.brandId];
			// } else {
			// 	return ['brands', 'draft'];
			// }
			return ['brands', 'draft'];
		},

		// Getters
		// -

		getSavePath(savePath) {
			return extendArray(self.baseSavePath, savePath, true);
		},

		// Bools
		// -

		get isOpen() {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			return popup.isOpen(popupEditBrandKey);
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		// -

		validate: (callback) => {

			// Validation des données
			// ---

			const store = getRoot(self);
			const app = store.app;
			const brands = store.brands;

			let errors = [];

			const brand = self.brand;
			if (brand) {

				// Nom manquant ?
				if (!brand.name) {
					errors.push(app.addError(
						self.getSavePath(['name']),
						"Nom manquant.",
					));
				}

				// Existe déjà ?
				if (!self.brandId && brand.id && brands.by_id.has(brand.id)) {
					errors.push(app.addError(
						self.getSavePath(['name']),
						"Existe déjà.",
					));
				}
			}

			if (callback) {
				callback(errors);
			}
			return errors;
		},

		save: () => {

			// Sauvegarde de la marque
			// ---

			const store = getRoot(self);
			const app = store.app;
			const brands = store.brands;
			const draft = brands.draft;

			// Sauvegarde de l'image sur le disque
			if (draft.logo.file) {
				draft.logo.setField('id', draft.id);
				draft.logo.saveToDisk(brands.filesFolderPath);
				draft.logo.setField('base64', '');
			}

			brands.setBrand(draft);
			brands.save();
		},

		// -

		open: () => {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			popup.open(popupEditBrandKey);
		},

		close: () => {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			app.clearErrors();

			popup.close(popupEditBrandKey);
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** PopupEditBrand *****
// **************************

const TAG_PopupEditBrand = () => {}
export const popupEditBrandKey = 'popupEditBrand';
export const PopupEditBrand = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const popup = app.popup;
	const brands = store.brands;
	const popupEditBrand = store.popupEditBrand;

	// From ... store

	const isLoading = app.isLoading;
	const isOpen = popupEditBrand.isOpen;

	// ...

	const brandId = popupEditBrand.brandId;
	const brand = popupEditBrand.brand;

	// Events
	// ==================================================================================================

	const handleClose = () => {
		popup.clearMessage(popupEditBrandKey);
	}

	// -

	const handleNameBlur = (savePath, value) => {
		if (!brandId && value) {
			brand.setField("id", sanitizeString(value));
		}
	}

	// -

	const handleBtnCancel = () => {
		popupEditBrand.close();
	}

	const handleBtnValidate = () => {
		popupEditBrand.validate((errors) => {
			if (errors.length == 0) {
				popupEditBrand.save();
				popupEditBrand.close();
			}
		})
	}

	// Render
	// ==================================================================================================

	// Popup --> Title
	// -----------------------------------------------

	let popupTitle = (brandId) ? "Modification marque" : "Nouvelle marque";

	// Popup --> Content
	// -----------------------------------------------

	let popupContent = null;
	if (isOpen) {
		if (brand) {

			const brandNameSavePath = popupEditBrand.getSavePath(['name']);
			const brandLogoSavePath = popupEditBrand.getSavePath(['logo']);

			popupContent = (
				<div>

					<Row marginBottom="normal">
						<Field
							id="txt-brand-name"
							component='input'
							label="Nom"
							savePath={brandNameSavePath}
							disabled={isLoading}
							callbackBlur={handleNameBlur}
						/>
					</Row>

					<Row>
						<ImageDropzone
							id="img-brand-logo"
							component='input'
							label="Logo"
							filesFolderPath={brands.filesFolderPath}
							savePath={brandLogoSavePath}
							disabled={isLoading}
						/>
					</Row>

				</div>
			)
		} else {
			popupContent = (
				<Helper
					iconName="copyright"
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
			key="btn-edit-brand-cancel"
			disabled={isLoading}
			onClick={() => handleBtnCancel()}
		>
			Annuler
		</Button>
	)

	popupButtons.push(
		<Button
			key="btn-edit-brand-validate"
			disabled={isLoading}
			color="primary"
			onClick={() => handleBtnValidate()}
		>
			{(brandId) ? "Modifier" : "Créer"}
		</Button>
	)

	// -----------------------------------------------

	return (
		<Popup
			id={popupEditBrandKey}
			title={popupTitle}
			// maxWidth="md"
			buttons={popupButtons}

			callbackClose={handleClose}
		>
			{popupContent}
		</Popup>
	)
})
