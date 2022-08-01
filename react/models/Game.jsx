import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';


// Models
// ======================================================================================================

// ***** GameStore *****
// *********************

const TAG_GameStore = () => {}
export const GameStore = types
	.model({
		id: types.maybeNull(types.string),
		name: types.maybeNull(types.string),
		release_date: types.maybeNull(types.string),
		genre: types.maybeNull(types.string),

		cover: types.maybeNull(types.string),
		background: types.maybeNull(types.string),

		disc_status: types.maybeNull(types.string), // none, shipping, possesed
		store_status: types.maybeNull(types.string), // none, shipping, possesed

		optimisation_status: types.maybeNull(types.string), // none, partial, full
		optimisation_date: types.maybeNull(types.string),

		hidden: false,
		pinned: false,

		tags: types.optional(types.array(types.string), []),
	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

	}))
