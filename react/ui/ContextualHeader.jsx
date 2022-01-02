import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Header } from 'nexus/layout/header/Header';
import { HomeHeaderMiddle } from 'nexus/contexts/home/Home';
import { AboutHeaderLeft } from 'nexus/contexts/about/About';
import { AdminHeaderLeft } from 'nexus/contexts/admin/Admin';
import { AccountHeaderLeft } from 'nexus/contexts/account/Account';

import { SearchHeaderMiddle } from 'vgm_client/contexts/search/Search';
import { CollectionHeaderLeft } from 'vgm_client/contexts/collection/Collection';


// Functions Components ReactJS
// -------------------------------------------------------------------------------------------------------------

// ***** ContextualHeader *****
// ****************************

const TAG_ContextualHeader = () => {}
export const ContextualHeader = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// From ... store

	const context = app.context;
	const homeContext = app.homeContext;
	const authContext = app.authContext;

	// Render
	// ==================================================================================================

	let headerLeft = null;
	let headerMiddle = null;
	let headerRight = null;

	// -------------------------------------------------

	const renderHeaderHome = () => {

		if ([homeContext, authContext].indexOf(context) == -1 ) { return; }

		headerMiddle = <HomeHeaderMiddle />
	}

	const renderHeaderSearch = () => {

		if (context != 'search') { return; }

		headerMiddle = <SearchHeaderMiddle />
	}

	// -------------------------------------------------

	const renderHeaderCollection = () => {

		if (context != 'collection') { return; }

		headerMiddle = <CollectionHeaderLeft />
	}

	// -------------------------------------------------

	const renderHeaderAbout = () => {

		if (context != app.aboutContext) { return; }

		headerLeft = <AboutHeaderLeft />
	}

	const renderHeaderAdmin = () => {

		if (context != app.adminContext) { return; }

		headerLeft = <AdminHeaderLeft />
	}

	// -------------------------------------------------

	const renderHeaderAccount = () => {

		if (context != app.accountContext) { return; }

		headerLeft = <AccountHeaderLeft />
	}

	// -------------------------------------------------

	renderHeaderHome();
	renderHeaderSearch();

	renderHeaderCollection();

	renderHeaderAbout();
	renderHeaderAdmin();

	renderHeaderAccount();

	return (
		<Header
			left={headerLeft}
			right={headerRight}
		>
			{headerMiddle}
		</Header>
	)
})
