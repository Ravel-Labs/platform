import axios from "axios";
import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

const ravelRouteKey = "ravel-route";

// For now, let's only track view duration on track page. Can whitelist as we see fit.
const trackedRoutes = ["/track/:trackSlug"];
// TODO: share event types constant with the backend.
const pageViewType = "PAGE_VIEW";

const trackLocation = async (location) => {
  const nowMs = Date.now();
  const lastLocationData = JSON.parse(localStorage.getItem(ravelRouteKey));

  // If we previously stored the startTime for a route we care about, make sure we send the full duration to the backend.
  if (lastLocationData) {
    const timeOnRoute = nowMs - lastLocationData.startTimeMs;
    const analyticsPayload = {
      location: lastLocationData.location,
      eventType: pageViewType,
      duration: timeOnRoute,
      trackSlug: lastLocationData.trackSlug,
    };

    await axios.post("/api/analytics", analyticsPayload);
  }

  // If we care about tracking the new location, set the starttime in localStorage.
  const match = trackedRoutes.reduce((accum, routePath) => {
    const routeMatch = matchPath(location.pathname, {
      path: routePath,
      exact: true,
      strict: false,
    });

    return accum || routeMatch;
  }, null);

  if (Boolean(match)) {
    localStorage.setItem(
      ravelRouteKey,
      JSON.stringify({
        location,
        trackSlug: match.params?.trackSlug,
        startTimeMs: nowMs,
      })
    );
  } else {
    localStorage.removeItem(ravelRouteKey, {
      location,
      startTimeMs: nowMs,
    });
  }
};

export default function RouteAnalytics() {
  let location = useLocation();

  useEffect(() => {
    const callAsync = async (newLocation) => {
      await trackLocation(newLocation);
    };
    callAsync(location);
  }, [location]);

  return null;
}
