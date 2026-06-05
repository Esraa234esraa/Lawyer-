import { Helmet } from 'react-helmet-async'
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from '@/constants/site'

type SeoProps = {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export default function Seo({
  title,
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  url,
  type = 'website',
}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const fullUrl = url || SITE_URL
  const resolvedImage = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta key="description" name="description" content={description} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:image" property="og:image" content={resolvedImage} />
      <meta key="og:url" property="og:url" content={fullUrl} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={fullTitle} />
      <meta key="twitter:description" name="twitter:description" content={description} />
      <meta key="twitter:image" name="twitter:image" content={resolvedImage} />
      <link key="canonical" rel="canonical" href={fullUrl} />
    </Helmet>
  )
}