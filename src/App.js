import { Route, Switch } from "react-router";
import "./App.css";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        {/* TODO: CRIO_TASK_MODULE_REGISTER - To add route for /register */}
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Products />
        </Route>
        {/* <Route path="/checkout">
          <Checkout />
        </Route>

        <Route path="/thanks">
          <Thanks />
        </Route> */}

        {/* TODO: CRIO_TASK_MODULE_REGISTER - To add route for /login */}

        {/* <Route path="/">
          <Home />
        </Route> */}
      </Switch>
    </div>
  );
}

export default App;
