const axios = require("axios");
const hound = require("hound");
let currentWindow = {};
let track = true;
module.exports.whatDoneOnFile = (deviceUser) => {
  let changedFiles = [];
  watcher = hound.watch("C:\\user\\melkam\\Entertaiment");
  watcher.on("create", function (name, stats) {
    //console.log(file + " file was created");
    changedFiles.push({ deviceUser, name, changedMode: "create" });
  });
  watcher.on("change", function (name, stats) {
    //console.log(name + " was changed");
    changedFiles.push({ deviceUser, name, changedMode: "changed" });
  });
  watcher.on("delete", function (name, stats) {
    //console.log(name + " was deleted");
    changedFiles.push({ deviceUser, name, changedMode: "deleted" });
  });
  watcher.unwatch("C:/Users/Tsadik/AppData");
  //displying the changed files every 10 seconds.
  const display = async () => {
    let currentChangedFiles = [...changedFiles];
    changedFiles.splice(0, currentChangedFiles.length);
    console.log(currentChangedFiles);
    currentChangedFiles.map(async (currentChangedFile) => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/changedFiles",
          currentChangedFile
        );
        //console.log("the data is\n ", res.data.track);
        track = res.data.track;
      } catch (error) {
        //console.log(error.response.data);
      }
    });
  };
  let interval = setInterval(display, 2000); // Hello, John
  if (track == false) {
    clearInterval(interval);
  }
};

//a function that tells what name is open.
module.exports.whatFileOpen = async (deviceUser) => {
  var monitor = require("active-window");
  let app = null
  let title = null;
  let host = "";
  let activeWindows = [];
  let startTime = Date.now();
  let endTime = null;

  callback = async (window) => {
    try {
      app = window.app;
      title = window.title;
      let duration = 1;
      let activeWindow = { deviceUser, app, title, host , duration };
        if (app != null && title != null && track == true) {
          console.log("sending request.");
          activeWindow.host = generateHostAndTitle(title).host;
          activeWindow.title = generateHostAndTitle(title).title;
          const res = await axios.post(
            "http://localhost:5000/api/activeWindows",
            activeWindow
          );
          console.log(res.data);
          //console.log("the track is ", res.data.track)
          track = res.data.track;
          currentWindow = {duration:res.data.openSuspiciousWindow.duration, host: res.data.openSuspiciousWindow.host, title: res.data.openSuspiciousWindow.title};
          if (res.data.openSuspiciousWindow.duration > 5) {
            //console.log("you are using", res.data.host, " ", res.data.title, "too long!");
            //console.log(duration);
          }
          return res.data;
        }
      // let app2 = window.app;
      // let title2 = window.title;
      // if (app != app2 || title != title2) {
      //   endTime = Date.now();
      //   let duration = parseInt((endTime - startTime) / 1000);
      //   startTime = Date.now();
      //   let activeWindow = { deviceUser, app, title, host , duration };
      //   if (app != null && title != null) {
      //     activeWindow.host = generateHostAndTitle(title).host;
      //     activeWindow.title = generateHostAndTitle(title).title;
      //     const res = await axios.post(
      //       "http://localhost:5000/api/activeWindows",
      //       activeWindow
      //     );
      //     console.log(res.data);
      //   }
      //   app = app2;
      //   title = title2;
      // }
    } catch (err) {
      console.log(err);
    }
  };

  //Watch the active window
  monitor.getActiveWindow(callback, -1, 1);
};

function generateHostAndTitle(rawTitle){
  let host = ""
  let title = ""
  let titleArray = rawTitle.split(" - ");
  if (titleArray.length >= 3) {
      let spaceHost = titleArray[titleArray.length - 2];
      let noSpaceHostArray = spaceHost.split(" ");
      noSpaceHostArray.forEach(element => {
        host += element;
    });
  }
  let spaceTitle = titleArray[0];
  let pos1 = spaceTitle.indexOf("(");
  let pos2 = spaceTitle.indexOf(")") + 1;
  spaceTitle = spaceTitle.replace(spaceTitle.substring(pos1, pos2),"")
  let noSpaceTitleArray = spaceTitle.split(" ");
  noSpaceTitleArray.forEach(element => {
      title += element;
  }); 
  let hostAndTitle = { title: title} 
  if (host != "") {
      hostAndTitle.host = host
  }
  return hostAndTitle
  }
  module.exports.getDuration = () =>{
    return currentWindow;
  };