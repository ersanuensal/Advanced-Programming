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

	win.loadURL(`http://localhost:3000/`);

	// Button to close the App
	ipc.on("minimizeApp", () => {
		console.log("Clicked on Minimize Btn");
		win.minimize();
	});

	// Button to maximize the App
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

	// command to close App
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


