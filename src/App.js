import Register from "./components/Register";
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
          <Register />
        {/* <Route path="/login">
          <Login />
        </Route> */}
        {/* <Route exact path="/">
          <Products />
        </Route> */}

        {/* TODO: CRIO_TASK_MODULE_REGISTER - To add route for /login */}

        {/* <Route path="/">
          <Home />
        </Route> */}
    </div>
  );
}

export default App;
