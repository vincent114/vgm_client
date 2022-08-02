import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { BrandStore } from 'vgm_client/contexts/brand/Brand';

import { HeaderTitle } from 'nexus/layout/header/Header';
import { MenuItem } from 'nexus/layout/menu/Menu';
import { Grid } from 'nexus/layout/grid/Grid';

import { Helper } from 'nexus/ui/helper/Helper';
import { IconButton } from 'nexus/ui/button/Button';
import { Avatar } from 'nexus/ui/avatar/Avatar';
import {
	Thumbnail,
	ThumbnailGhost
} from 'nexus/ui/thumbnail/Thumbnail';
import { Popover } from 'nexus/ui/popover/Popover';
import {
	List,
	ListItem,
	ListIcon,
	ListText
} from 'nexus/ui/list/List';

import './Brands.css';


// Models
// ======================================================================================================

// ***** BrandsStore *****
// ***********************

const TAG_BrandsStore = () => {}
export const BrandsStore = types
	.model({
		by_id: types.map(BrandStore),

		draft: types.optional(BrandStore, {}),

		loaded: false,
	})
	.views(self => ({

		get collectionFilePath() {
			const store = getRoot(self);
			const library = store.library;
			const path = ipc.sendSync('pathJoin', [library.collectionPath, 'brands.json']);
			return path;
		},

		get filesFolderPath() {
			const store = getRoot(self);
			const library = store.library;
			const path = ipc.sendSync('pathJoin', [library.collectionFilesPath, 'brands']);
			return path;
		},

		// -

		get nbBrands() {
			return Object.entries(self.by_id.toJSON()).length;
		},

		// Getters
		// -

		getSortedByName() {
			let brandsList = [];
			for (const [brandId, brand] of self.by_id.entries()) {
				brandsList.push(brand);
			}
			brandsList.sort(function (a, b) {
				if (a.name > b.name)
					return 1;
				if (a.name < b.name)
					return -1;
				return 0;
			});
			return brandsList;
		},

	}))
	.actions(self => ({

		setField: (field, value) => {
			self[field] = value;
		},

		setBrand: (brand) => {
			self.by_id.set(brand.id, BrandStore.create(brand.toJSON()));
		},

		// -

		load: (callback) => {

			// Chargement des marques
			// ---

			const store = getRoot(self);
			const app = store.app;

			app.readJsonFile(
				self.collectionFilePath,
				{
					by_id: {},
				},
				(raw) => {
					app.saveValue(['brands', 'by_id'], raw.by_id, () => {
						self.setField('loaded', true);
						if (callback) {
							callback();
						}
					});
				},
				app.debugMode,
			);
		},

		save: (callback) => {

			// Sauvegarde des marques
			// ---

			const store = getRoot(self);
			const app = store.app;
			app.writeJsonFile(self.collectionFilePath, self.toJSON());

			if (callback) {
				callback();
			}
		},

		createNew: () => {

			// Création d'une nouvelle marque
			// ---

			const store = getRoot(self);
			const app = store.app;
			const helpers = app.helpers;
			const popupEditBrand = store.popupEditBrand;

			self.draft = BrandStore.create({
				'id': helpers.generateUUID(),
				'idx': 0,
			});
			popupEditBrand.setField('brandId', '');
			popupEditBrand.open();
		},

		edit: (brandId) => {

			// Modification de la marque passée en paramètres
			// ---

			const store = getRoot(self);
			const popupEditBrand = store.popupEditBrand;

			const brand = self.by_id.get(brandId);
			if (brand) {
				self.draft = BrandStore.create(brand.toJSON());
				popupEditBrand.setField('brandId', brandId);
				popupEditBrand.open();
			}
		},

		delete: (brandId) => {

			// Suppression de la marque passée en paramètres
			// ---

			const store = getRoot(self);
			const plateforms = store.plateforms;
			const games = store.games;

			const brand = self.by_id.get(brandId);
			if (brand) {

				// Suppression logo
				brand.logo.deleteFromDisk(self.filesFolderPath);

				// Suppression des plateformes
				for (const plateformId of brand.plateform_ids) {
					plateforms.delete(plateformId);
				}

				self.by_id.delete(brandId);
			}
		},

	}))


// Functions Components ReactJS
// ======================================================================================================

// ***** BrandThumbnail *****
// **************************

const TAG_BrandThumbnail = () => {}
export const BrandThumbnail = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const snackbar = app.snackbar;
	const brands = store.brands;

	// From ... state

	const [hover, setHover] = React.useState(false);
	const [anchorMenu, setAnchorMenu] = React.useState(null);

	// From ... props

	const isPlaying = (props.isPlaying == true) ? true : false;

	const brand = props.brand;

	const callbackClick = props.callbackClick;

	let style = (props.style) ? props.style : style;

	// ...

	// Events
	// ==================================================================================================

	const handleEnter = (evt) => {
		setHover(true);
	}

	const handleLeave = (evt) => {
		setHover(false);
	}

	// -

	const handleOpenMenu = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setAnchorMenu(event.currentTarget);
	}

	const handleCloseMenu = (evt) => {
		if (evt) {
			evt.preventDefault();
			evt.stopPropagation();
		}
		setAnchorMenu(null);
	}

	// -

	const handleEdit = () => {
		brands.edit(brand.id);
		handleCloseMenu();
	}

	const handleDelete = () => {
		handleCloseMenu();
		const CONFIRM_DELETE = "Êtes-vous sûr de vouloir supprimer cette marque ? (cela supprimera toutes les plateformes et jeux associés)";
		if (confirm(CONFIRM_DELETE)) {
			brands.delete(brand.id);
			snackbar.update(true, "Marque supprimée.", "success");
		}
	}

	// Render
	// ==================================================================================================

	// Thumbnail :: Bottom Right
	// ---------------------------------------------------

	let bottomRight = null;
	if (hover) {
		bottomRight = (
			<div className="flex-0">
				<Avatar
					iconName="more_horiz"
					iconVariant="filled"
					// iconColor="#FFFFFF"
					iconColor="typography"
					color="transparent"
					size="tiny"
					style={{
						margin: '5px',
						// opacity: '0.9',
						stopPropagation: true,
						backdropFilter: 'blur(4px)',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleOpenMenu(e);
					}}
				/>
				<Popover
					id={`pop-brand-${brand.id}`}
					open={Boolean(anchorMenu)}
					anchorEl={anchorMenu}
					onClose={handleCloseMenu}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					{brand && (
						<List
							style={{
								paddingTop: '10px',
								paddingBottom: '10px',
							}}
						>

							<ListItem
								size="small"
								onClick={() => handleEdit()}
							>
								<ListIcon
									name="mode_edit"
								/>
								<ListText withIcon={true}>
									Modifier
								</ListText>
							</ListItem>

							<ListItem
								size="small"
								onClick={() => handleDelete()}
							>
								<ListIcon
									name="delete"
								/>
								<ListText withIcon={true}>
									Supprimer
								</ListText>
							</ListItem>

						</List>
					)}
				</Popover>
			</div>
		)
	}

	// ---------------------------------------------------

	return (
		<Thumbnail
			src={brand.logo.url}
			iconName="copyright"
			title={brand.name}
			subtitle={brand.subtitle}
			size="small"

			bottomRight={bottomRight}

			rootStyle={style}

			callbackEnter={handleEnter}
			callbackLeave={handleLeave}
			callbackClick={callbackClick}
		/>
	)
})

// ***** RenderBrands *****
// ************************

const TAG_RenderBrands = () => {}
export const RenderBrands = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const genres = store.genres;
	const brands = store.brands;

	// From ... store

	const isLoading = store.isLoading;

	const nbBrands = brands.nbBrands;
	const brandsList = brands.getSortedByName();

	// ...

	// Events
	// ==================================================================================================

	const handleBrandClick = (brandId) => {
		store.navigateTo('brand', brandId);
	}

	// Renderers
	// ==================================================================================================

	// Fantômes flex
	let ghosts = []
	for (var i = 0; i < 10; i++) {
		ghosts.push(
			<ThumbnailGhost
				key={`thumbnail-ghost-${i}`}
				size="small"
				style={{
					marginRight: '16px',
				}}
			/>
		)
	}

	return (
		<div>

			<Grid
				// style={{
				// 	paddingLeft: '20px',
				// 	paddingRight: '20px',
				// }}
			>
				{brandsList.map((brand, brandIdx) => (
					<BrandThumbnail
						key={`thumbnail-brand-${brand.id}`}
						brand={brand}
						style={{
							marginRight: '20px',
							marginBottom: '30px',
						}}
						callbackClick={() => handleBrandClick(brand.id)}
					/>
				))}
				{ghosts}
			</Grid>

		</div>
	)
})

// ***** BrandsHeaderLeft *****
// ****************************

const TAG_BrandsHeaderLeft = () => {}
export const BrandsHeaderLeft = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const brands = store.brands;

	// From ... store

	const nbBrands = brands.nbBrands;
	const loaded = store.loaded;

	// ...

	let title = "";
	if (loaded) {
		title = `${nbBrands} ${(nbBrands > 1) ? "Marques" : "Marque"}`;
	}

	// Render
	// ==================================================================================================

	return (
		<HeaderTitle
			title={title}
			titleStyle={{
				marginLeft: '10px',
			}}
		/>
	)
})

// ***** BrandsHeaderRight *****
// *****************************

const TAG_BrandsHeaderRight = () => {}
export const BrandsHeaderRight = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const brands = store.brands;

	// From ... store

	const isLoading = app.isLoading;

	// ...

	// Events
	// ==================================================================================================

	const handleAddBrand = () => {
		brands.createNew();
	}

	// Render
	// ==================================================================================================

	return (
		<React.Fragment>
			<IconButton
				iconName="add"
				color="#FFFFFF"
				disabled={isLoading}
				onClick={handleAddBrand}
			/>
		</React.Fragment>
	)
})

// ***** BrandsMenuItem *****
// **************************

const TAG_BrandsMenuItem = () => {}
export const BrandsMenuItem = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const menu = app.menu;

	// ...

	const brandsContext = 'brands';

	// Events
	// ==================================================================================================

	const handleMenuItemClick = () => {
		store.navigateTo(brandsContext);
		app.menu.close();
	}

	// Render
	// ==================================================================================================

	return (
		<MenuItem
			iconName="sports_esports"
			label="Ludothèque"
			activeContexts={[brandsContext]}
			callbackClick={handleMenuItemClick}
		/>
	)
})

// ***** BrandsPage *****
// **********************

const TAG_BrandsPage = () => {}
export const BrandsPage = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const brands = store.brands;

	// From ... store

	const loaded = store.loaded;
	const nbBrands = brands.nbBrands;

	// ...

	const showHelper = (!loaded || nbBrands == 0) ? true : false;

	// Renderers
	// ==================================================================================================

	const renderPage = () => {

		// Render :: Page
		// ---

		let pageContent = null;
		if (!showHelper) {
			pageContent = <RenderBrands />
		}
		return pageContent;
	}

	const renderHelper = () => {

		// Render :: Helper
		// ---

		return (
			<Helper
				iconName="sports_esports"
				show={showHelper}
			/>
		)
	}

	return (
		<div className="nx-page">
			{renderPage()}
			{renderHelper()}
		</div>
	)
})
