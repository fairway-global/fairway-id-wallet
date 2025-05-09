import { useMemo } from "react";

// Map routes to dynamic titles using regular expressions
const routesToTitles: {
  pattern: RegExp;
  title: string;
  showBackBtn?: boolean;
}[] = [
  { pattern: /^\/dashboard\/$/, title: "Credentials", showBackBtn: false },
  { pattern: /^\/dashboard\/scan\/$/, title: "Scan", showBackBtn: false },
  {
    pattern: /^\/dashboard\/settings\/$/,
    title: "Settings",
    showBackBtn: false,
  },
  {
    pattern: /^\/dashboard\/credentials\/$/,
    title: "Credentials",
    showBackBtn: false,
  },
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

const usePageTitles = (
  pathname: string
): { title: string; showBackBtn: boolean } => {
  const route = useMemo(() => {
    const route = routesToTitles.find(({ pattern }) => pattern.test(pathname));
    return {
      title: route?.title || "Dashboard",
      showBackBtn:
        route?.showBackBtn === false || route?.title === "Dashboard"
          ? false
          : true,
    };
  }, [pathname]);
  const { title, showBackBtn } = route;
  return { title, showBackBtn };
};

export default usePageTitles;
