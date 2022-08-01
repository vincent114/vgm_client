import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { GameStore } from 'vgm_client/models/Game';


// Models
// ======================================================================================================

// ***** GamesStore *****
// **********************

const TAG_GamesStore = () => {}
export const GamesStore = types
	.model({
		by_id: types.map(GameStore),

		draft: types.optional(GameStore, {}),

		loaded: false,
	})
	.views(self => ({

		get collectionFilePath() {
			const store = getRoot(self);
			const library = store.library;
			const path = ipc.sendSync('pathJoin', [library.collectionPath, 'games.json']);
			return path;
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		// -

		load: (callback) => {

			// Chargement des jeux
			// ---

			const store = getRoot(self);
			const app = store.app;

			app.readJsonFile(
				self.collectionFilePath,
				{
					by_id: {},
				},
				(raw) => {
					app.saveValue(['games', 'by_id'], raw.by_id, () => {
						self.setField('loaded', true);
						if (callback) {
							callback();
						}
					});
				}
			);
		},

		save: (callback) => {

			// Sauvegarde des jeux
			// ---

			const store = getRoot(self);
			const app = store.app;
			app.writeJsonFile(self.collectionFilePath, self.toJSON());

			if (callback) {
				callback();
			}
		},

		createNew: () => {

			// Création d'un nouveau jeu
			// ---

			const store = getRoot(self);
			const app = store.app;
			const helpers = app.helpers;
			const popupEditGame = store.popupEditGame;

			self.draft = GameStore.create({
				'id': helpers.generateUUID(),
				'disc_status': 'none',
				'store_status': 'none',
				'optimisation_status': 'none',
			});
			popupEditGame.open();
		},

	}))
