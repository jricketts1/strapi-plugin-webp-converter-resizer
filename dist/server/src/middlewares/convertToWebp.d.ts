import type { Core } from '@strapi/strapi';
import { Context, Next } from 'koa';
declare const _default: ({ config }: {
    config: any;
}, { strapi }: {
    strapi: Core.Service;
}) => (ctx: Context, next: Next) => Promise<void>;
export default _default;
