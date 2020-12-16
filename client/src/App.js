// import React from 'react';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
// import Track from './routes/Track';
// import APITest from './routes/APITest';

import './App.css';

const Home = lazy(() => import('./routes/Home'));
const Track = lazy(() => import('./routes/Track'));
const APITest = lazy(() => import('./routes/APITest'));

export default function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/track">
                <Track />
              </Route>
              <Route path="/api-test">
                <APITest />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}
