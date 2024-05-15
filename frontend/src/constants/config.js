import { forOwn } from 'lodash-es'

const settings = {
    AUTH0_CLIENT_ID: {
        required: true,
        value: import.meta.env.VITE_AUTH0_CLIENT_ID,
    },
    AUTH0_DOMAIN: {
        required: true,
        value: import.meta.env.VITE_AUTH0_DOMAIN,
    },
    BASE_URL: {
        required: true,
        value: import.meta.env.VITE_BASE_URL,
    },
    WEB_SOCET_URL: {
        required: false,
        value: import.meta.env.VITE_WEB_SOCET_URL,
    },
    CALENDAR_URL: {
        required: false,
        value:
            import.meta.env.VITE_CALENDAR_URL ||
            'https://novel.systems/calendar',
    },
    CLOUDINARY_CLOUD_NAME: {
        required: true,
        value: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
    FACEBOOK_PIXEL_ID: {
        required: false,
        value: import.meta.env.VITE_FACEBOOK_PIXEL_ID,
    },
    GOOGLE_ANALYTICS_ID: {
        required: false,
        value: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
    ID_TOKEN_NAMESPACE: {
        required: true,
        value:
            import.meta.env.VITE_ID_TOKEN_NAMESPACE || 'https://eu.placeholder-1platform.com/',
    },
    IS_DEBUG: {
        default: import.meta.env.VITE_IS_DEBUG === 'true',
        required: true,
        value: import.meta.env.VITE_IS_DEBUG === 'true',
    },
    LOGO_DARK_URL: {
        required: true,
        value:
            import.meta.env.VITE_LOGO_DARK_URL ||
            //'https://res.cloudinary.com/novel.systems/image/upload/c_scale,w_500/v1581419636/Placeholder-1%20Logos/wordmark_black.png',
            'https://res.cloudinary.com/novel.systems/image/upload/v1606900986/Placeholder-1%20Logos/app.svg',
    },
    LOGO_LIGHT_URL: {
        required: true,
        value:
            import.meta.env.VITE_LOGO_LIGHT_URL ||
            'https://res.cloudinary.com/novel.systems/image/upload/c_scale,w_500/v1581419635/Placeholder-1%20Logos/wordmark_white.png',
    },
    EMBLEM_DARK_URL: {
        required: true,
        value: 'https://res.cloudinary.com/novel.systems/image/upload/v1581419640/Placeholder-1%20Logos/emblem_black.png',
    },
    LOGROCKET_ID: {
        required: false,
        value: import.meta.env.VITE_LOGROCKET_ID,
    },
    PLATFORM_OWNER_NAME: {
        required: true,
        value: import.meta.env.VITE_PLATFORM_OWNER_NAME || 'Placeholder-1',
    },
    PLATFORM_OWNER_NAME_CAPS: {
        required: true,
        value: import.meta.env.VITE_PLATFORM_OWNER_NAME || 'PLACEHOLDER-1',
    },
    PLATFORM_OWNER_WEBSITE: {
        required: true,
        value:
            import.meta.env.VITE_PLATFORM_OWNER_WEBSITE ||
            'https://novel.systems',
    },
    PRIVACY_URL: {
        required: false,
        value:
            import.meta.env.VITE_PRIVACY_URL ||
            'https://novel.systems/privacy',
    },
    SEO_IMAGE_URL: {
        required: false,
        value:
            import.meta.env.VITE_SEO_IMAGE_URL ||
            'https://res.cloudinary.com/novel.systems/image/upload/c_fill,g_center,h_630,w_1200/rqn6uonv2nuzmkyanrqj',
    },
    SEO_PAGE_DESCRIPTION: {
        required: true,
        value:
            import.meta.env.VITE_SEO_PAGE_DESCRIPTION ||
            'Organized in the Helsinki Area, Finland, Placeholder-1 is a meeting place for thousands of developers, designers, and entrepreneurs. A weekend-long experience, gathering tech enthusiasts from all over the world to create with the latest technology in a unique environment and atmosphere.',
    },
    SEO_PAGE_TITLE: {
        required: true,
        value:
            import.meta.env.VITE_SEO_PAGE_TITLE ||
            'Experience Europe´s Leading Hackathon Platform',
    },
    SEO_TWITTER_HANDLE: {
        required: false,
        value: import.meta.env.VITE_SEO_TWITTER_HANDLE || '@hackPlaceholder-1',
    },
    TERMS_URL: {
        required: false,
        value:
            import.meta.env.VITE_TERMS_URL || 'https://novel.systems/terms',
    },
    SEO_PAGE_LOGIN_DESCRIPTION: {
        required: true,
        value: 'Login to see something',
    },
    METABASE_SECRET_KEY: {
        required: false,
        value: import.meta.env.VITE_METABASE_SECRET_KEY,
    },
    METABASE_SITE_URL: {
        required: false,
        value: import.meta.env.VITE_METABASE_SITE_URL,
    },
}
const buildConfig = () => {
    const config = {}
    forOwn(settings, (obj, key) => {
        if (!obj.value) {
            if (typeof obj.default !== 'undefined') {
                config[key] = obj.default
            } else {
                if (obj.required) {
                    throw new Error(
                        `Invalid configuration: ${key} must be provided a value from .env, or a default value. See config.js`,
                    )
                }
            }
        } else {
            config[key] = obj.value
        }
    })

    return config
}

const config = buildConfig()

export default config
