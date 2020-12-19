const os = require("os");
const axios = require("axios");

const registerComputerUser = async () => {
  const deviceName = os.hostname();
  const macAddress = "something" || os.networkInterfaces()["Wi-Fi"][0].mac;
  const userName = os.userInfo().username;
  const online = true;
  const data = { macAddress, deviceName, userName, online };
  try {
    const deviceUser = await axios.post(
      "http://localhost:5000/api/deviceUsers",
      data
    );
    console.log(deviceUser.data)
    return deviceUser.data;
  } catch (error) {
    console.log(error);
  }
};
module.exports = registerComputerUser;
