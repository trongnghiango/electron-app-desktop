import {app, BrowserWindow, dialog, ipcMain, IpcMainEvent} from 'electron';
import {join, basename} from 'path';
import {URL} from 'url';
import * as fs from 'fs';

import {renameAndChangeFileList} from '../../utils/fileHandler';

async function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    vibrancy: 'under-window',
    visualEffectState: 'active',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
  });

  // browserWindow.webContents.on(
  //   "new-window",
  //   (
  //     event: Event,
  //     url,
  //     frameName,
  //     disposition,
  //     options,
  //     additionalFeatures
  //   ) => {

  //     if (frameName === "modal") {
  //       // open window as modal
  //       Object.assign(options, {
  //         modal: true,
  //         parent: browserWindow,
  //         width: 300,
  //         titleBarStyle: "hidden",
  //         frame: true,
  //         height: 100,
  //       });
  //       return new BrowserWindow(options);
  //     }
  //   }
  // );

  ipcMain.on('showFolderDialog', (event: IpcMainEvent) => {
    const options: Electron.OpenDialogOptions = {properties: ['openDirectory'], defaultPath: ''};
    let fileSelectionPromise = dialog.showOpenDialog(options);
    fileSelectionPromise.then(async function (obj) {
      //event.sender.send("selectedfolders", obj.filePaths);
      if (obj) mainWindow.webContents.send('openDir', obj.filePaths[0]);

      const result = await renameAndChangeFileList(obj.filePaths[0], `${obj.filePaths[0]}/`).catch(
        (error: any) => console.error(error),
      );

      // .then(
      //   (files: any) => event.sender.send('files_list', files)
      // );
      result.every((file: any, index: number) => {
        let stats: fs.Stats = fs.statSync(file);
        event.sender.send('fileslist', basename(file), stats);
        return true;
      });
    });
  });

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (import.meta.env.DEV) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test.
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  await mainWindow.loadURL(pageUrl);

  return mainWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
