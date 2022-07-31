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

		loaded: false,
	})
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

	}))
