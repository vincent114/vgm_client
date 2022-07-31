import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';


// Models
// ======================================================================================================

// ***** LibraryStore *****
// ************************

const TAG_LibraryStore = () => {}
export const LibraryStore = types
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

		load: () => {

		},

	}))
