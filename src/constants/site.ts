export const SITE_NAME = 'مكتب مريم بنت محمد للمحاماة والاستشارات القانونية'
export const SITE_URL = 'https://lawm.runasp.net'
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/social-share.svg`

export const pageUrl = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`