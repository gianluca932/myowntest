import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";
import Container from "./components/container";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Container name={"Chat - Application Containers"} />
      </Provider>
    </div>
  );
}

export default App;
