import React from "react"

import {
  Route,
  Redirect
} from 'react-router-dom';

function PrivateRoute({ children, isAuthenticated, ...rest }) {


  return (
    <Route
      {...rest}
      render={
        ({ location }) => (
          isAuthenticated
            ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location }
                }}
              />
            ))
      }
    />
  );
}

export default PrivateRoute;
