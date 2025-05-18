/// <reference types="koa" />
declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: {};
        validator(): void;
    };
    controllers: {
        controller: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            index(ctx: any): void;
        };
    };
    routes: {
        method: string;
        path: string;
        handler: string;
        /**
         * Plugin server methods
         */
        config: {
            policies: any[];
        };
    }[];
    services: {
        service: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            getWelcomeMessage(): string;
        };
    };
    contentTypes: {};
    policies: {};
    middlewares: {
        convertToWebp: ({ config }: {
            config: any;
        }, { strapi }: {
            strapi: import("@strapi/types/dist/core").Service;
        }) => (ctx: import("koa").Context, next: import("koa").Next) => Promise<void>;
    };
};
export default _default;
