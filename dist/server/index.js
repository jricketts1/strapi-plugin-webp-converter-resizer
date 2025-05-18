"use strict";
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const sharp__default = /* @__PURE__ */ _interopDefault(sharp);
const DEFAULT_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const convertToWebp = ({ config: config2 }, { strapi }) => {
  const IMAGE_TYPES = config2("mimeTypes", DEFAULT_IMAGE_TYPES);
  const SHARP_OPTIONS = config2("options");
  return async (ctx, next) => {
    const isUpload = ctx.url === "/upload" && ctx.method === "POST" && ctx.request.files && ctx.request.body && ctx.request.body.fileInfo;
    if (isUpload) {
      const files = ctx.request.files;
      for (const key in files) {
        const fileOrFiles = files[key];
        if (Array.isArray(fileOrFiles)) {
          for (const file of fileOrFiles) {
            await processFile(file, ctx, IMAGE_TYPES, SHARP_OPTIONS, strapi);
          }
        } else {
          const file = fileOrFiles;
          await processFile(file, ctx, IMAGE_TYPES, SHARP_OPTIONS, strapi);
        }
      }
    }
    await next();
  };
};
const processFile = async (file, ctx, IMAGE_TYPES, SHARP_OPTIONS, strapi) => {
  const filePath = file.filepath;
  if (IMAGE_TYPES.includes(file.mimetype)) {
    const webpFileName = `${path.parse(file.originalFilename).name}.webp`;
    const webpFilePath = path.join(path.dirname(filePath), webpFileName);
    const fileInfo = JSON.parse(ctx.request.body.fileInfo);
    fileInfo.name = webpFileName;
    ctx.request.body.fileInfo = JSON.stringify(fileInfo);
    try {
      const sharpResult = await sharp__default.default(filePath).webp(SHARP_OPTIONS).toFile(webpFilePath);
      await fs.promises.unlink(filePath);
      file.size = sharpResult.size;
      file.filepath = webpFilePath;
      file.originalFilename = webpFileName;
      file.mimetype = "image/webp";
    } catch (error) {
      strapi.log.error(
        `Plugin (strapi-plugin-webp-converter): Image Converter Middleware: Error converting ${file.originalFilename} to webp:`,
        error
      );
    }
  } else {
    strapi.log.info(
      `Plugin (strapi-plugin-webp-converter): Image Converter Middleware: No convertable image ${file.originalFilename}`
    );
  }
};
const middlewares = {
  convertToWebp
};
const bootstrap = ({ strapi }) => {
  const config2 = strapi.plugin("webp-converter");
  strapi.server.use(middlewares.convertToWebp(config2, { strapi }));
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("webp-converter").service("service").getWelcomeMessage();
  }
});
const controllers = {
  controller
};
const policies = {};
const routes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  }
];
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  }
});
const services = {
  service
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
module.exports = index;
