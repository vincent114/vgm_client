import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { PlateformStore } from 'vgm_client/contexts/plateform/Plateform';


// Models
// ======================================================================================================

// ***** PlateformsStore *****
// ***************************

const TAG_PlateformsStore = () => {}
export const PlateformsStore = types
	.model({
		by_id: types.map(PlateformStore),

		draft: types.optional(PlateformStore, {}),

		loaded: false,
	})
	.views(self => ({

		get collectionFilePath() {
			const store = getRoot(self);
			const library = store.library;
			const path = ipc.sendSync('pathJoin', [library.collectionPath, 'plateforms.json']);
			return path;
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		// -

		load: (callback) => {

			// Chargement des plateformes
			// ---

			const store = getRoot(self);
			const app = store.app;

			app.readJsonFile(
				self.collectionFilePath,
				{
					by_id: {},
				},
				(raw) => {
					app.saveValue(['plateforms', 'by_id'], raw.by_id, () => {
						self.setField('loaded', true);
						if (callback) {
							callback();
						}
					});
				}
			);
		},

		save: (callback) => {

			// Sauvegarde des plateformes
			// ---

			const store = getRoot(self);
			const app = store.app;
			app.writeJsonFile(self.collectionFilePath, self.toJSON());

			if (callback) {
				callback();
			}
		},

		createNew: (brandId) => {

			// Création d'une nouvelle plateforme
			// ---

			const store = getRoot(self);
			const app = store.app;
			const helpers = app.helpers;
			const popupEditPlateform = store.popupEditPlateform;

			self.draft = PlateformStore.create({
				'id': helpers.generateUUID(),
				'cover_shape': 'vertical',
				'brand_id': (brandId) ? brandId : '',
			});
			popupEditPlateform.open();
		},

	}))
