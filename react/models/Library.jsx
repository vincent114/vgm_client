import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import {
	getFromStorage,
	setToStorage
} from 'nexus/utils/Storage';


// Models
// ======================================================================================================

// ***** LibraryStore *****
// ************************

const TAG_LibraryStore = () => {}
export const LibraryStore = types
	.model({
		path_to_use: types.maybeNull(types.string), // default, custom
		custom_path: types.maybeNull(types.string),
		custom_path_available: true,

		loaded: false,
	})
	.views(self => ({

		get defaultCollectionPath() {
			const cwd = ipc.sendSync('getCwd');
			return ipc.sendSync('pathJoin', [cwd, 'collection']);
		},

		get defaultCollectionCoversPath() {
			const path = ipc.sendSync('pathJoin', [self.defaultCollectionPath, 'covers']);
			return path;
		},

		// -

		get collectionPath() {
			if (self.custom_path && self.custom_path_available) {
				return self.custom_path;
			} else {
				return self.defaultCollectionPath;
			}
		},

		get collectionCoversPath() {
			const path = ipc.sendSync('pathJoin', [self.collectionPath, 'covers']);
			return path;
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		// -

		refreshAvailability: () => {

			// Le chemin personnalisé de la collection est-il toujours accessible ?
			// ---

			if (!self.custom_path) { return; }

			if (ipc.sendSync('existsSync', self.custom_path)) {
				self.custom_path_available = true;
			} else {
				self.custom_path_available = false;
			}
		},

		update: (raw) => {
			self.path_to_use = (raw.path_to_use) ? raw.path_to_use : "default";
			self.custom_path = raw.custom_path;
			self.custom_path_available = raw.custom_path_available;

			self.loaded = true;
		},

		load: () => {

			// Chargement des paramètres de la ludothèque
			// ---

			const store = getRoot(self);
			const app = store.app;

			const params = getFromStorage('params', null, 'json');
			if (!params) {
				self.save();
			}
			self.update(params);

			ipc.sendSync('mkdirsSync', self.defaultCollectionPath);
			ipc.sendSync('mkdirsSync', self.defaultCollectionCoversPath);

			self.refreshAvailability();
			if (self.custom_path && self.custom_path_available) {
				ipc.sendSync('mkdirsSync', self.collectionCoversPath);
			}
		},

		save: (callback) => {

			// Sauvegarde des paramètres de la ludothèque
			// ---

			const params = self.toJSON();
			setToStorage('params', params, 'json');

			if (callback) {
				callback();
			}
		},

	}))
