import { cmsApi } from "../axios";

export const getFAQ = () => {
  return cmsApi.post("/", {
    query: `{ frequentlyAskedQuestion { faqMarkdown } }`,
  });
};

export const getSocial = () => {
  return cmsApi.post("/", {
    query: `{ socialMediaPage { discord twitter verifiedContract} }`,
  });
};

export const getHeader = () => {
  return cmsApi.post("/", {
    query: `{ announcement { markdownContent styling } }`,
  });
};

export const getIntent = () => {
  return cmsApi.post("/", {
    query: `{ intent { url text hashtags via related } }`,
  });
};
