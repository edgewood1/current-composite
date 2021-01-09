import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./home-component";
import "./layout"
import { HelloComponent } from "./home-component";
import { Layout } from "./layout";
import useCustomElement from 'use-custom-element';
import BasicExample from './index-clean';
 
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.


  const routes = [
    {
      path: "/",
      exact: true,
      sidebar: () => <div>home!</div>,
      main: () => <h2>Home</h2>
    },
    {
      path: "/bubblegum",
      sidebar: () => <div>bubblegum!</div>,
      main: () => <h2>Bubblegum</h2>
    },
    {
      path: "/shoelaces",
      sidebar: () => <div>shoelaces!</div>,
      main: () => <h2>Shoelaces</h2>
    }
  ];

  const main = { display: "grid", gridTemplateAreas: `'search search' 'sidebar main' 'footer footer'`, gridTemplateColumns: "10vw 90vw", gridTemplateRows: "10vh 85vh 5vh" };

  export default function BasicExample2() {
    return (
      <Router>
        <div style={main}>
          {/* search bar */}
          <div style={{ width: "100vw", gridArea: 'search'}}>header</div>
          {/* side bar */}
          <div
            style={{
              padding: "10px",
              background: "#f0f0f0",
              gridArea: 'sidebar'
            }}
          >

            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/bubblegum">Bubblegum</Link>
              </li>
              <li>
                <Link to="/shoelaces">Shoelaces</Link>
              </li>
            </ul>
  
            <Switch>
              {routes.map((route, index) => (
                // You can render a <Route> in as many places
                // as you want in your app. It will render along
                // with any other <Route>s that also match the URL.
                // So, a sidebar or breadcrumbs or anything else
                // that requires you to render multiple things
                // in multiple places at the same URL is nothing
                // more than multiple <Route>s.
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  children={<route.sidebar />}
                />
              ))}
            </Switch>
          </div>
  
          <div style={{gridArea: 'main'}} >
            <Switch>
              {routes.map((route, index) => (
                // Render more <Route>s with the same paths as
                // above, but different components this time.
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  children={<route.main />}
                />
              ))}
            </Switch>
          </div>
          <div style={{ gridArea: 'footer', width: "100vw"}}>footer</div>
        </div>
      </Router>
    );
  }
  
