import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  author?: string;
  path?: string;
  type?: "website" | "article";
}

const SITE_NAME = "OpenComputer";
const BASE_URL = "https://opencomputer.dev";
const DEFAULT_IMAGE = `${BASE_URL}/social-preview.png`;

const SEO = ({ title, description, author, path = "/", type = "website" }: SEOProps) => {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} – ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {author && <meta name="author" content={author} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:image:alt" content={title} />

      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
    </Helmet>
  );
};

export default SEO;
