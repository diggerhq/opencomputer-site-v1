import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  author?: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
}

const SITE_NAME = "OpenComputer";
const BASE_URL = "https://opencomputer.dev";
const DEFAULT_IMAGE = `${BASE_URL}/social-preview.png`;

const SEO = ({ title, description, author, path = "/", type = "website", image }: SEOProps) => {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} – ${SITE_NAME}`;
  const imageUrl = image ? `${BASE_URL}${image}` : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
    </Helmet>
  );
};

export default SEO;
