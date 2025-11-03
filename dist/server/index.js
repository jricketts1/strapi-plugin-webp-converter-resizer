"use strict";
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const sharp__default = /* @__PURE__ */ _interopDefault(sharp);
const generateAltText = (filename) => {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
};
const DEFAULT_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const convertToWebp = ({ config: config2 }, { strapi }) => {
  const IMAGE_TYPES = config2("mimeTypes", DEFAULT_IMAGE_TYPES);
  const SHARP_WEBP_OPTIONS = config2("options").webp;
  const MAX_IMAGE_WIDTH = config2("options").maxWidth;
  const AUTO_ALT_TEXT = config2("options").autoAltText;
  return async (ctx, next) => {
    const isUpload = ctx.url === "/upload" && ctx.method === "POST" && ctx.request.files && ctx.request.body && ctx.request.body.fileInfo;
    if (isUpload) {
      const files = ctx.request.files;
      for (const key in files) {
        const fileOrFiles = files[key];
        if (Array.isArray(fileOrFiles)) {
          for (const file of fileOrFiles) {
            await processFile(
              file,
              ctx,
              IMAGE_TYPES,
              SHARP_WEBP_OPTIONS,
              MAX_IMAGE_WIDTH,
              AUTO_ALT_TEXT,
              strapi
            );
          }
        } else {
          const file = fileOrFiles;
          await processFile(
            file,
            ctx,
            IMAGE_TYPES,
            SHARP_WEBP_OPTIONS,
            MAX_IMAGE_WIDTH,
            AUTO_ALT_TEXT,
            strapi
          );
        }
      }
    }
    await next();
  };
};
const processFile = async (file, ctx, IMAGE_TYPES, SHARP_WEBP_OPTIONS, MAX_IMAGE_WIDTH, AUTO_ALT_TEXT, strapi) => {
  const filePath = file.filepath;
  if (IMAGE_TYPES.includes(file.mimetype)) {
    const webpFileName = `${path.parse(file.originalFilename).name}.webp`;
    const webpFilePath = path.join(path.dirname(filePath), webpFileName);
    const fileInfo = JSON.parse(ctx.request.body.fileInfo);
    fileInfo.name = webpFileName;
    ctx.request.body.fileInfo = JSON.stringify(fileInfo);
    try {
      const image = sharp__default.default(filePath);
      const metadata = await image.metadata();
      let pipeline = image;
      if (metadata.width && metadata.width > MAX_IMAGE_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_IMAGE_WIDTH });
      }
      const sharpResult = await pipeline.rotate().webp(SHARP_WEBP_OPTIONS).toFile(webpFilePath);
      await fs.promises.unlink(filePath);
      file.size = sharpResult.size;
      file.filepath = webpFilePath;
      file.originalFilename = webpFileName;
      file.mimetype = "image/webp";
      if (!fileInfo.alternativeText && AUTO_ALT_TEXT) {
        fileInfo.alternativeText = generateAltText(webpFileName);
        ctx.request.body.fileInfo = JSON.stringify(fileInfo);
      }
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
