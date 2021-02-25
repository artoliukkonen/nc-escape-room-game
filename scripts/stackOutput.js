const path = require("path");
const fs = require("fs-extra");
const dotenv = require("dotenv");
const os = require("os");

const replaceInEnvFile = async (file, envs) => {
  const keys = Object.keys(envs);
  if (keys.length <= 0) {
    return;
  }
  const envFile = path.join(__dirname, "../frontend", file);
  console.log(envFile);

  await fs.ensureFile(envFile);
  const content = await fs.readFile(envFile);
  const envConfig = await dotenv.parse(content);

  keys.forEach((key) => {
    envConfig[key] = envs[key];
  });

  await fs.remove(envFile);
  await Promise.all(
    Object.keys(envConfig).map((key) =>
      fs.appendFile(envFile, `${key}=${envConfig[key]}${os.EOL}`)
    )
  );
};

const handler = async (data, serverless, _) => {
  const { ServiceEndpoint } = data;
  const stage = _.s || _.stage || serverless.service.provider.stage;

  if (ServiceEndpoint) {
    const serviceName = serverless.service.serviceObject.name
      .replace(/\-/g, "_")
      .toUpperCase();

    if (stage === "dev") {
      await replaceInEnvFile(".env.development", {
        [`REACT_APP_${serviceName}_ENDPOINT`]: ServiceEndpoint,
      });
    } else if (stage === "prod") {
      await replaceInEnvFile(".env.production", {
        [`REACT_APP_${serviceName}_ENDPOINT`]: ServiceEndpoint,
      });
    } else {
      await replaceInEnvFile(`.env.${stage}`, {
        [`REACT_APP_${serviceName}_ENDPOINT`]: ServiceEndpoint,
      });
    }
  }
};

module.exports = { handler };
