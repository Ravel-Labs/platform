// import React from 'react';
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';
import RouteAnalytics from './RouteAnalytics';
import { UserContext } from './Context';

import './App.css';

const Home = lazy(() => import('./routes/Home'));
const Login = lazy(() => import('./routes/Login'));
const Signup = lazy(() => import('./routes/Signup'));
const Profile = lazy(() => import('./routes/Profile'));
const Track = lazy(() => import('./routes/Track'));
const TrackFeedback = lazy(() => import('./routes/TrackFeedback'));
const TrackStats = lazy(() => import('./routes/TrackStats'));
const Upload = lazy(() => import('./routes/Upload'));
const APITest = lazy(() => import('./routes/APITest'));

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <div>
          <UserContext.Provider value={{user: loggedInUser, onUpdateUser: setLoggedInUser}}>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/signup">
                  <Signup />
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
                <Route path="/debug">
                  <APITest />
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
