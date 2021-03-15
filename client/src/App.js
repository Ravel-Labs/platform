import axios from "axios";
import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import Header from "./Header";
import RouteAnalytics from "./RouteAnalytics";
import { UserContext } from "./Context";

import "./App.css";

const About = lazy(() => import("./routes/About"));
const Account = lazy(() => import("./routes/Account"));
const Home = lazy(() => import("./routes/Home"));
const Login = lazy(() => import("./routes/Login"));
const Profile = lazy(() => import("./routes/Profile"));
const Signup = lazy(() => import("./routes/Signup"));
const Track = lazy(() => import("./routes/Track"));
const TrackFeedback = lazy(() => import("./routes/TrackFeedback"));
const TrackStats = lazy(() => import("./routes/TrackStats"));
const Upload = lazy(() => import("./routes/Upload"));

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/user");
        setLoggedInUser(res.data);
      } catch (e) {
        console.error(e);
        setLoggedInUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <div>
          <UserContext.Provider
            value={{ user: loggedInUser, onUpdateUser: setLoggedInUser }}
          >
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/signup">
                  <Signup />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/track/:trackSlug/feedback">
                  <TrackFeedback />
                </Route>
                <Route path="/track/:trackSlug/stats">
                  <TrackStats />
                </Route>
                <Route path="/track/:trackSlug">
                  <Track />
                </Route>
                <Route path="/upload">
                  <Upload />
                </Route>
                <Route path="/:username/account">
                  <Account />
                </Route>
                <Route path="/:username">
                  <Profile />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Suspense>
            <RouteAnalytics />
          </UserContext.Provider>
        </div>
      </Router>
    </div>
  );
}
