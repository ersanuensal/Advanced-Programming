const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const ipc = ipcMain;
require("./app.js");

function createWindow() {
	const win = new BrowserWindow({
		width: 1400,
		height: 800,
		minHeight: 1000,
		minWidth: 1600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});
	// win.webContents.openDevTools();

	win.loadURL(`http://localhost:3000/`);

	//// CLOSE APP
	ipc.on("minimizeApp", () => {
		console.log("Clicked on Minimize Btn");
		win.minimize();
	});

	//// MAXIMIZE RESTORE APP
	ipc.on("maximizeRestoreApp", () => {
		if (win.isMaximized()) {
			console.log("Clicked on Restore");
			win.restore();
		} else {
			console.log("Clicked on Maximize");
			win.maximize();
		}
	});
	// Check if is Maximized
	win.on("maximize", () => {
		win.webContents.send("isMaximized");
	});
	// Check if is Restored
	win.on("unmaximize", () => {
		win.webContents.send("isRestored");
	});

	//// CLOSE APP
	ipc.on("closeApp", () => {
		console.log("Clicked on Close Btn");
		win.close();
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

const isMac = process.platform === "darwin";

const template = [
	// { role: 'appMenu' }
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							role: "about",
						},
						{
							type: "separator",
						},
						{
							role: "services",
						},
						{
							type: "separator",
						},
						{
							role: "hide",
						},
						{
							role: "hideothers",
						},
						{
							role: "unhide",
						},
						{
							type: "separator",
						},
						{
							role: "quit",
						},
					],
				},
		  ]
		: []),
	// { role: 'fileMenu' }
	{
		label: "File",
		submenu: [
			isMac
				? {
						role: "close",
				  }
				: {
						role: "quit",
				  },
			{
				label: "New Window",
				click: function () {
					createWindow();
				},
			},
			{
				label: "Save",
				click: function () {
					createWindow();
				},
			},
		],
	},
	// { role: 'editMenu' }
	{
		label: "Edit",
		submenu: [
			{
				role: "undo",
			},
			{
				role: "redo",
			},
			{
				type: "separator",
			},
			{
				role: "cut",
			},
			{
				role: "copy",
			},
			{
				role: "paste",
			},
			...(isMac
				? [
						{
							role: "pasteAndMatchStyle",
						},
						{
							role: "delete",
						},
						{
							role: "selectAll",
						},
						{
							type: "separator",
						},
						{
							label: "Speech",
							submenu: [
								{
									role: "startSpeaking",
								},
								{
									role: "stopSpeaking",
								},
							],
						},
				  ]
				: [
						{
							role: "delete",
						},
						{
							type: "separator",
						},
						{
							role: "selectAll",
						},
				  ]),
		],
	},
	// { role: 'viewMenu' }
	{
		label: "View",
		submenu: [
			{
				role: "reload",
			},
			{
				role: "forceReload",
			},
			{
				role: "toggleDevTools",
			},
			{
				type: "separator",
			},
			{
				role: "resetZoom",
			},
			{
				role: "zoomIn",
			},
			{
				role: "zoomOut",
			},
			{
				type: "separator",
			},
			{
				role: "togglefullscreen",
			},
		],
	},
	// { role: 'windowMenu' }
	{
		label: "Window",
		submenu: [
			{
				role: "minimize",
			},
			{
				role: "zoom",
			},
			...(isMac
				? [
						{
							type: "separator",
						},
						{
							role: "front",
						},
						{
							type: "separator",
						},
						{
							role: "window",
						},
				  ]
				: [
						{
							role: "close",
						},
				  ]),
		],
	},
	{
		role: "help",
		submenu: [
			{
				label: "Documentation",
				click: async () => {
					const { shell } = require("electron");
					await shell.openExternal(
						"https://github.com/ersanuensal/Advanced-Programming/blob/main/README.md"
					);
				},
			},
		],
	},
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
