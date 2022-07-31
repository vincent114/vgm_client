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

	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

	}))
