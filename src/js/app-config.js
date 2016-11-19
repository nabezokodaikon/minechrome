const path = require("path");
const fs = require("fs");
const log4js = require("log4js");

const appDir = path.resolve("");
const appConfigFile = path.join(appDir, "app-config.json");
const appConfig = JSON.parse(fs.readFileSync(appConfigFile), "utf8");

log4js.configure("app-config.json", { cwd: appDir });
const logger = log4js.getLogger("default");

module.exports = {
  getAppConfig: () => {
    return appConfig;
  },
  getLogger: () => {
    return logger;
  }
}
