import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainContextProvider } from "./hooks/useMainContext";
import { Viewer } from "./Components/Viewer/Viewer";
import CheckoutPage from "./Components/Viewer/CheckoutPage/CheckoutPage";
import AuthPage from "./Components/Viewer/CheckoutPage/AuthPage";

function App() {
  return (
    <Router>
      <MainContextProvider>
        <Routes>
          <Route path="/" element={<Viewer />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </MainContextProvider>
    </Router>
  );
}

export default App;
