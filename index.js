const electron = require("electron");
const { app, BrowserWindow, Notification } = electron;
let monitor = require("active-window");
const registerComputerUser = require("./js_electron/computerUser");
const { whatDoneOnFile } = require("./js_electron/activityTrack");
const { whatFileOpen, getDuration } = require("./js_electron/activityTrack");
let mainWindow;
let id = null;
let suspisiousWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    height: 200,
    width: 400,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/html/index.html`);
  // mainWindow.webContents.on("did-finish-load", () => {
  //   mainWindow.webContents.send("computerUser:submit", computerUser());
  // });
  registerComputerUser().then((data) => {
    console.log("inside the function.", data._id);
    id = data._id;
    // setTimeout(() => {
    //   whatDoneOnFile(data._id);
    // }, 10);
  });
  setTimeout(() => {
    whatDoneOnFile(id);
    whatFileOpen(id);
  }, 1000);
  // setInterval(() => {
  //   console.log("the durtion is now ", getDuration())
  // }, 1000);

var myVar = setInterval(myTimer, 1000);

function myTimer() {
  //console.log("the duration is ", getDuration().duration)
  if (!getDuration().duration) {
    suspisiousWindow = undefined;
  }
  console.log(getDuration().duration)
 if (getDuration().duration >10) {
    if (getDuration().host != suspisiousWindow) {
      let activeWin = "";
      if (getDuration().app) {
        activeWin += getDuration().app + " ";
      } 
      if (getDuration().host) {
        activeWin += getDuration().host + " ";
      }
      if (getDuration().title) {
        activeWin += getDuration().title + " ";
      }
      new Notification({
        title: 'warning',
        body: `openning ${activeWin}for too long is forbidden on work time..`
    }).show();
    suspisiousWindow = getDuration().host; 
    }

   //clearInterval(myVar)
 }
}
});
