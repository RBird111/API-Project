import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";
import * as spotActions from "./store/spot";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotDetails from "./components/SpotDetails";
import CreateSpot from "./components/CreateSpot";
import UpdateSpot from "./components/UpdateSpot";
import ManageSpots from "./components/ManageSpots";
import ManageReviews from "./components/ManageReviews";

function App() {
  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(dispatch(spotActions.getAllSpots()))
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />

      {isLoaded && (
        <Switch>
          <Route exact path={`/`}>
            <AllSpots />
          </Route>

          <Route path={`/spots/new`}>
            <CreateSpot />
          </Route>

          <Route path={`/spots/current`}>
            <ManageSpots />
          </Route>

          <Route path={`/spots/:spotId/edit`}>
            <UpdateSpot />
          </Route>

          <Route path={`/spots/:spotId`}>
            <SpotDetails />
          </Route>

          <Route path={`/reviews/current`}>
            <ManageReviews />
          </Route>

          {/* TODO: Add Manage Bookings Page */}
          <Route path={`/reviews/current`}>
            <h1>Page Not Found</h1>
          </Route>

          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
