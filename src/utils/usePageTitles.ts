import { useMemo } from "react";

// Map routes to dynamic titles using regular expressions
const routesToTitles: { pattern: RegExp; title: string }[] = [
  { pattern: /^\/dashboard\/$/, title: "Credentials" },
  { pattern: /^\/dashboard\/scan\/$/, title: "Scan" },
  { pattern: /^\/dashboard\/settings\/$/, title: "Settings" },
  { pattern: /^\/dashboard\/credentials\/$/, title: "Credentials" },
  {
    pattern: /^\/dashboard\/credentials\/work\/.+\/$/,
    title: "Credential Detail",
  },
  {
    pattern: /^\/dashboard\/credentials\/education\/.+\/$/,
    title: "Credential Detail",
  },
  { pattern: /^\/dashboard\/credentials\/verifyId\/$/, title: "Verify Id" },
  {
    pattern: /^\/dashboard\/credentials\/verificationResult\/$/,
    title: "Verify Id",
  },
];

const usePageTitles = (pathname: string): string => {
  const title = useMemo(() => {
    const route = routesToTitles.find(({ pattern }) => pattern.test(pathname));
    return route?.title || "Dashboard";
  }, [pathname]);

  return title;
};

export default usePageTitles;
