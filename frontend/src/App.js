import { useState, useEffect } from "react";
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
import ManageBookings from "./components/ManageBookings";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearch, setIsSearch] = useState({ query: "", search: false });

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(dispatch(spotActions.getAllSpots()))
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation setIsSearch={setIsSearch} isLoaded={isLoaded} />

      {isLoaded && (
        <Switch>
          <Route exact path={`/`}>
            <AllSpots setIsSearch={setIsSearch} isSearch={isSearch} />
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

          <Route path={`/bookings/current`}>
            <ManageBookings />
          </Route>

          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
      )}

      <Footer />
    </>
  );
}

export default App;
