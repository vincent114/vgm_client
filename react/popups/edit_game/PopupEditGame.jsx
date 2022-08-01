import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Field } from 'nexus/forms/field/Field';

import { Row } from 'nexus/layout/row/Row';

import { Helper } from 'nexus/ui/helper/Helper';
import { Popup } from 'nexus/ui/popup/Popup';
import { Button } from 'nexus/ui/button/Button';

import './PopupEditGame.css';


// Models
// ======================================================================================================

// ***** PopupEditGameStore *****
// ***********************************

const TAG_PopupEditGameStore = () => {}
export const PopupEditGameStore = types
	.model({
		gameId: types.maybeNull(types.string),
	})
	.views(self => ({

		get game() {
			const store = getRoot(self);
			const games = store.games;
			if (self.gameId) {
				return games.by_id.get(self.gameId);
			} else {
				return games.draft;
			}
		},

		get baseSavePath() {
			if (self.gameId) {
				return ['games', 'by_id', self.gameId];
			} else {
				return ['games', 'draft'];
			}
		},

		// Bools
		// -

		get isOpen() {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			return popup.isOpen(popupEditGameKey);
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

			popup.open(popupEditGameKey);
		},

		close: () => {
			const store = getRoot(self);
			const app = store.app;
			const popup = app.popup;

			popup.close(popupEditGameKey);
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** PopupEditGame *****
// *************************

const TAG_PopupEditGame = () => {}
export const popupEditGameKey = 'popupEditGame';
export const PopupEditGame = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const popup = app.popup;
	const popupEditGame = store.popupEditGame;

	// From ... store

	const isLoading = app.isLoading;
	const isOpen = popupEditGame.isOpen;

	// ...

	const gameId = popupEditGame.gameId;
	const game = popupEditGame.game;

	// Events
	// ==================================================================================================

	const handleBtnCancel = () => {
		popupEditGame.close();
	}

	const handleBtnValidate = () => {
		// TODO
	}

	// Render
	// ==================================================================================================

	// Popup --> Title
	// -----------------------------------------------

	let popupTitle = (gameId) ? "Modification jeu" : "Nouveau jeu";

	// Popup --> Content
	// -----------------------------------------------

	let popupContent = null;
	if (isOpen) {
		if (game) {
			popupContent = (
				<div>

				</div>
			)
		} else {
			popupContent = (
				<Helper
					iconName="sports_esports"
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
			key="btn-edit-game-cancel"
			disabled={isLoading}
			onClick={() => handleBtnCancel()}
		>
			Annuler
		</Button>
	)

	popupButtons.push(
		<Button
			key="btn-edit-game-validate"
			disabled={isLoading}
			color="primary"
			onClick={() => handleBtnValidate()}
		>
			{(gameId) ? "Modifier" : "Créer"}
		</Button>
	)

	// -----------------------------------------------

	return (
		<Popup
			id={popupEditGameKey}
			title={popupTitle}
			// maxWidth="md"
			buttons={popupButtons}
		>
			{popupContent}
		</Popup>
	)
})
