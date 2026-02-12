import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainContextProvider } from "./hooks/useMainContext";
import { Viewer } from "./Components/Viewer/Viewer";
import CheckoutPage from "./Components/Viewer/CheckoutPage/CheckoutPage";

function App() {
  return (
    <Router>
      <MainContextProvider>
        <Routes>
          <Route path="/" element={<Viewer />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </MainContextProvider>
    </Router>
  );
}

export default App;
