
const {
	app,
	dialog,
	shell,
	BrowserWindow,
	Menu,
	globalShortcut,
	ipcMain,
} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const package = require('./package.json');


// Datas
// ======================================================================================================

let mainWindow = null;

const platform = os.platform();


// Functions
// ======================================================================================================

const createWindow = () => {

	// Fenêtre de l'application
	// ---

	let winState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	});

	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		titleBarOverlay: (platform == 'win32') ? {
			color: '#216464',
			symbolColor: '#FFFFFF'
		} : false,
		trafficLightPosition: { x: 10, y: 20 },

		x: winState.x,
		y: winState.y,
		width: winState.width,
		height: winState.height,

		webPreferences: {
			// nodeIntegration: false,
			// contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	winState.manage(mainWindow);
	if (platform == 'win32') {
		mainWindow.setMenuBarVisibility(false);
	}

	mainWindow.loadFile('main.html');
}

const initOsMenus = () => {

	// Menu système de l'application (macOS)
	// ---

	if (platform != 'darwin') { return; }

	let template = [];

	template.push({
		label: 'VGM',
		submenu: [
			{
				label: 'A propos de VGM',
				click () {
					mainWindow.webContents.send("about");
				}
			},
			{type: 'separator'},
			{
				label: 'Préférences',
				accelerator: 'CmdOrCtrl+,',
				click () {
					mainWindow.webContents.send("admin");
				}
			},
			{type: 'separator'},
			{role: 'services', submenu: []},
			{type: 'separator'},
			{
				role: 'hide',
				label: 'Masquer VGM',
			},
			{
				role: 'hideothers',
				label: 'Masquer les autress',
			},
			{
				role: 'unhide',
				label: 'Tout afficher',
			},
			{type: 'separator'},
			{
				role: 'quit',
				label: 'Quitter VGM',
			}
		]
	});

	template.push({
		label: 'Edition',
		submenu: [
			{
				role: 'undo',
				label: 'Annuler',
			},
			{
				role: 'redo',
				label: 'Rétablir',
			},
			{type: 'separator'},
			{
				role: 'cut',
				label: 'Couper',
			},
			{
				role: 'copy',
				label: 'Copier',
			},
			{
				role: 'paste',
				label: 'Coller',
			},
			{
				role: 'selectall',
				label: 'Tout sélectionner',
			}
		]
	});

	if (!package.isProd) {
		template.push({
			label: 'Debug',
			submenu: [
				{
					label: 'Recharger',
					accelerator: 'Cmd+R',
					click () {
						mainWindow.reload()
					}
				},
				{
					label: 'Outils de développement',
					accelerator: 'Alt+Cmd+I',
					click () {
						const win = BrowserWindow.getFocusedWindow();
						win.webContents.openDevTools();
					}
				}
			]
		});
	}

	template.push({
		role: 'window',
		label: 'Fenêtre',
		submenu: [
			{
				role: 'close',
				label: 'Fermer',
			},
			{
				role: 'minimize',
				label: 'Réduire',
			},
			{role: 'zoom'},
			{type: 'separator'},
			{
				role: 'front',
				label: 'Tout ramener au premier plan',
			}
		]
	});

	const appMenu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(appMenu);
}


// Events
// ======================================================================================================

// app events
// -------------------------------------------------------------------

app.on('window-all-closed', () => {

	// Toutes les fenêtres fermées ? -> on quitte l'application sur Windows et Linux
	if (platform !== 'darwin') {
		app.quit();
	}
})

app.whenReady().then(() => {

	createWindow();

	initOsMenus();

	// Re-création de la fenêtre sur macOS
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0){
			createWindow();
		}
	})

})

// ipc async events
// -------------------------------------------------------------------

ipcMain.on("chooseFolder", (event) => {

	// Sélection d'un dossier
	// ---

	dialog.showOpenDialog(mainWindow, {
		properties: ['openDirectory']
	}).then(result => {
		mainWindow.webContents.send("folderChoosed", result.filePaths);
	}).catch(err => {
		console.log(err)
	});
});

ipcMain.handle("readJson", async (event, [filePath]) => {

	// Lit et parse le fichier json passé en paramètres
	// ---

	const result = await fs.readJson(filePath);
	return result;
});

ipcMain.on("writeJSON", async (event, [filePath, datas, options]) => {

	// Ecrit des données dans le fichier passé en paramètres
	// ---

	options = (options) ? options : {};

	const result = await fs.writeJson(filePath, datas, options);
	mainWindow.webContents.send("JSONwritten", result);
});

// ipc sync events
// -------------------------------------------------------------------

ipcMain.on("getCwd", (event, [returnFormat]) => {

	// Quel est le current working directory ?
	// ---

	// const cwd = process.cwd();
	let cwd = __dirname;
	if (returnFormat == "parsed") {
		cwd = cwd.split(path.sep);
	}
	event.returnValue = cwd;
});

// ***** fs *****
// **************

ipcMain.on("pathJoin", (event, [pathParts]) => {

	// Join path parts
	// ---

	let joined = "";
	for (const pathPart of pathParts) {
		if (!joined) {
			joined = pathPart;
		} else {
			joined = `${joined}${path.sep}${pathPart}`
		}
	}
	event.returnValue = joined;
});

ipcMain.on("mkdirsSync", (event, [folderPath]) => {

	// Création du dossier passé en paramètres
	// ---

	event.returnValue = fs.mkdirsSync(folderPath);
});

ipcMain.on("existsSync", (event, [fileOrFolderPath]) => {

	// Le dossier / fichier passé en paramètres existe-t-il ?
	// ---

	event.returnValue = fs.existsSync(fileOrFolderPath);
});

ipcMain.on("copySync", (event, [params]) => {

	// Copie de fichier
	// ---

	event.returnValue = fs.copySync(params.source, params.target);
});

ipcMain.on("removeSync", (event, [targetPath]) => {

	// Suppression de fichier / dossier
	// ---

	event.returnValue = fs.removeSync(targetPath);
});

// ***** json *****
// ****************

ipcMain.on("readJsonSync", (event, [filePath]) => {

	// Lit et parse le fichier json passé en paramètres
	// ---

	event.returnValue = fs.readJsonSync(filePath);
});

ipcMain.on("writeJSONSync", (event, [filePath, datas, options]) => {

	// Ecrit des données dans le fichier passé en paramètres
	// ---

	options = (options) ? options : {};

	event.returnValue = fs.writeJSONSync(filePath, datas, options);
});


// ***** shell *****
// *****************

ipcMain.on("showItemInFolder", (event, [fullPath]) => {

	// Met en évidence le fichier ou le dossier passé en paramètres dans le Finder / Explorateur
	// ---

	event.returnValue = shell.showItemInFolder(fullPath);
});

ipcMain.on("openExternal", (event, [url]) => {

	// Ouvre l'URL passée en paramètres dans le navigateur par défaut
	// ---

	event.returnValue = shell.openExternal(url);
});

// ***** os *****
// **************

ipcMain.on("platform", (event, []) => {

	// Met en évidence le fichier ou le dossier passé en paramètres dans le Finder / Explorateur
	// ---

	event.returnValue = platform;
});
