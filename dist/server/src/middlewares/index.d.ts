/// <reference types="koa" />
declare const _default: {
    convertToWebp: ({ config }: {
        config: any;
    }, { strapi }: {
        strapi: import("@strapi/types/dist/core").Service;
    }) => (ctx: import("koa").Context, next: import("koa").Next) => Promise<void>;
};
export default _default;
