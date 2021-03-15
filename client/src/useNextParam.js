import { useLocation } from "react-router-dom";

/**
 * useNextParam returns the route captured in the `next` query param, or if none exists, the provided default path.
 * @param  {string} fallbackPath
 */
export default function useNextParam(fallbackPath) {
  let location = useLocation();
  const queryString = location.search;
  if (!queryString) {
    return fallbackPath;
  }

  const params = new URLSearchParams(queryString);
  return params.get("next") || fallbackPath;
}
