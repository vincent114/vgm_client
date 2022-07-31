import React from 'react';
import { types, getRoot } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

import { Header } from 'nexus/layout/header/Header';
import { SearchHeaderMiddle } from 'nexus/contexts/search/Search';
import { AboutHeaderLeft } from 'nexus/contexts/about/About';
import { AdminHeaderLeft } from 'nexus/contexts/admin/Admin';
import { AccountHeaderLeft } from 'nexus/contexts/account/Account';

import {
	BrandsHeaderLeft,
	BrandsHeaderRight
} from 'vgm_client/contexts/brands/Brands';
import {
	BrandHeaderLeft,
	BrandHeaderRight
} from 'vgm_client/contexts/brand/Brand';
import {
	PlateformHeaderLeft,
	PlateformHeaderRight
} from 'vgm_client/contexts/plateform/Plateform';


// Functions Components ReactJS
// -------------------------------------------------------------------------------------------------------------

// ***** ContextualHeader *****
// ****************************

const TAG_ContextualHeader = () => {}
export const ContextualHeader = observer((props) => {

	const store = React.useContext(window.storeContext);
	const app = store.app;

	// From ... store

	const breakPoint650 = app.breakPoint650;
	const context = app.context;
	const homeContext = app.homeContext;
	const authContext = app.authContext;

	// Render
	// ==================================================================================================

	let headerLeft = null;
	let headerMiddle = null;
	let headerRight = null;

	// -------------------------------------------------

	const renderHeaderSearch = () => {

		if (breakPoint650 && context != 'search') { return; }

		headerMiddle = <SearchHeaderMiddle />
	}

	// -------------------------------------------------

	const renderHeaderBrands = () => {

		if (context != 'brands') { return; }

		headerLeft = <BrandsHeaderLeft />
		headerRight = <BrandsHeaderRight />
	}

	const renderHeaderBrand = () => {

		if (context != 'brand') { return; }

		headerLeft = <BrandHeaderLeft />
		headerRight = <BrandHeaderRight />
	}

	const renderHeaderPlateform = () => {

		if (context != 'plateform') { return; }

		headerLeft = <PlateformHeaderLeft />
		headerRight = <PlateformHeaderRight />
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

	renderHeaderSearch();

	renderHeaderBrands();
	renderHeaderBrand();

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
