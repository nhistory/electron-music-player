const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { parseFile } = require('music-metadata');
const { inspect } = require('util');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 338,
    height: 740,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // win.webContents.openDevTools();
  win.loadFile('index.html');

  return win;
};

app.whenReady().then(() => {
  const mainWindow = createWindow();

  console.log(pathToFileURL('./music').href);

  const PATH = 'D:\\Coding\\assignment-3-nhistory-1\\music';
  let songList = [];
  let songData = fs.readdirSync(PATH);

  // console.log(songData);

  songData.forEach((song) => {
    (async () => {
      try {
        const metadata = await parseFile(
          PATH + '/' + song,
          { mimeType: 'audio/mpeg', size: 26838 },
          { duration: true }
        );
        // console.log(
        //   inspect(metadata.common.album, {
        //     showHidden: false,
        //     depth: null,
        //   })
        // );

        songList.push({
          track: Number(
            inspect(metadata.common.track.no, {
              showHidden: false,
              depth: null,
            })
          ),
          songName: inspect(metadata.common.title, {
            showHidden: false,
            depth: null,
          }).replace(/\'/gi, ''),
          path: PATH + '/' + song,
          artist: inspect(metadata.common.artist, {
            showHidden: false,
            depth: null,
          }).replace(/\'/gi, ''),
          genre: inspect(metadata.common.genre, {
            showHidden: false,
            depth: null,
          })
            .replace(/\'/gi, '')
            .replace(/\[/gi, '')
            .replace(/\]/gi, '')
            .trim(),
          image: {
            format: inspect(metadata.common.picture[0].format, {
              showHidden: false,
              depth: null,
            }).replace(/\'/gi, ''),
            data: inspect(metadata.common.picture[0].data, {
              showHidden: false,
              depth: null,
            })
              .replace(/\'/gi, '')
              .substring(8)
              .replace(/\>/gi, '')
              .toString('utf8'),
          },
          duration: {
            minute: (
              inspect(metadata.format.duration, {
                showHidden: false,
                depth: null,
              }) / 60
            )
              .toFixed(2)
              .substring(0, 1),
            second: (
              inspect(metadata.format.duration, {
                showHidden: false,
                depth: null,
              }) % 60
            ).toFixed(0),
          },
          album: inspect(metadata.common.album, {
            showHidden: false,
            depth: null,
          }).replace(/\'/gi, ''),
        });

        // console.log(songList);
      } catch (error) {
        console.error(error.message);
      }
    })();
  });

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('song-endpoint', songList);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
