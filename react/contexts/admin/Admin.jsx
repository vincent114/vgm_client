import React from 'react';
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Field } from 'nexus/forms/field/Field';

import { Section } from 'nexus/layout/section/Section';
import { Row } from 'nexus/layout/row/Row';

import { Helper } from 'nexus/ui/helper/Helper';
import { Icon } from 'nexus/ui/icon/Icon';
import { IconButton } from 'nexus/ui/button/Button';

import './Admin.css';


// Datas
// ======================================================================================================

const LIBRARY_TARGET_CHOICES = [
	{
		"value": "default",
		"label": "Emplacement par défaut",
	},
	{
		"value": "custom",
		"label": "Emplacement personnalisé",
	}
]


// Functions Components ReactJS
// ======================================================================================================

// ***** RenderSectionLibrary *****
// ********************************

const TAG_RenderSectionLibrary = () => {}
export const RenderSectionLibrary = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;
	const snackbar = app.snackbar;
	const library = store.library;

	// From ... store

	const isLoading = app.isLoading;
	const pathToUse = library.path_to_use;
	const customPath = library.custom_path;
	const customPathAvailable = library.custom_path_available;

	// ...

	// Events
	// ==================================================================================================

	const handleFieldChange = (savePath, value) => {
		library.save(() => {
			clearTimeout(window.timeoutReload);
			window.timeoutReload = setTimeout(() => {
				store.reload();
			}, 1000);
		});
	}

	const handleBrowseCustomPath = () => {
		ipc.once('folderChoosed', (folders) => {
			for (const folder of folders) {
				library.setField("path_to_use", "custom");
				library.setField("custom_path", folder);
				handleFieldChange();
				break;
			}
		});
		ipc.send('chooseFolder');
	}

	// Render
	// ==================================================================================================

	// Section -> Icon
	// -------------------------------------------------

	const sectionIcon = <Icon name="save" />

	// Section -> Title
	// -------------------------------------------------

	const sectionTitle = "Emplacement de sauvegarde";

	// Section -> Content
	// -------------------------------------------------

	let customPathError = "";
	if (pathToUse == "custom" && customPath && !customPathAvailable) {
		customPathError = "Dossier introuvable."
	}

	const sectionContent = (
		<div>
			<Field
				id="rad-path-to-use"
				component='radios'
				datas={LIBRARY_TARGET_CHOICES}
				savePath={['library', 'path_to_use']}
				disabled={isLoading}
				className="rad-path-to-use"
				style={{
					marginLeft: '2px',
				}}
				callbackChange={handleFieldChange}
			/>

			<Row>
				<Field
					id="txt-custom-path"
					component='input'
					savePath={['library', 'custom_path']}
					disabled={isLoading}
					error={customPathError}
					endAdornment={(
						<IconButton
							size="tiny"
							color="typography"
							iconName="more_horiz"
							disabled={isLoading}
							onClick={() => handleBrowseCustomPath()}
						/>
					)}
					style={{
						marginLeft: '43px',
					}}
					callbackBlur={handleFieldChange}
				/>
			</Row>
		</div>
	)

	// -------------------------------------------------

	return (
		<Section
			icon={sectionIcon}
			title={sectionTitle}
		>
			{sectionContent}
		</Section>
	)
})

// ***** RenderAdmin *****
// ***********************

const TAG_RenderAdmin = () => {}
export const RenderAdmin = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// ...

	// Render
	// ==================================================================================================

	return (
		<React.Fragment>
			<RenderSectionLibrary />
		</React.Fragment>
	)
})

// ***** AdminPage *****
// *********************

const TAG_AdminPage = () => {}
export const AdminPage = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// From ... store

	const initialized = app.initialized;

	// ...

	const showHelper = (!initialized) ? true : false;

	// Renderers
	// ==================================================================================================

	const renderPage = () => {

		// Render :: Page
		// ---

		let pageContent = null;
		if (initialized) {
			pageContent = <RenderAdmin />
		}
		return pageContent;
	}

	const renderHelper = () => {

		// Render :: Helper
		// ---

		return (
			<Helper
				iconName="setting"
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
