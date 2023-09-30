import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import Container from "./components/container";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Container />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
