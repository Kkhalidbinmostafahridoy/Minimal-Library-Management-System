import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { Layout } from "antd";
import { store } from "./app/store";

import { AppNavbar } from "./components/layout/AppNavbar";
import { AppFooter } from "./components/layout/AppFooter";
import { BookList } from "./features/books/BookList";
import { AddBook } from "./features/books/AddBook";
import { EditBook } from "./features/books/EditBook";
import { BorrowSummary } from "./features/summary/BorrowSummary";

const { Content } = Layout;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <AppNavbar />
          <Content style={{ padding: "0 50px", marginTop: 64 }}>
            <div
              style={{
                background: "#fff",
                padding: 24,
                minHeight: 380,
                marginTop: "1rem",
              }}
            >
              <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/add" element={<AddBook />} />
                <Route path="/edit/:id" element={<EditBook />} />
                <Route path="/summary" element={<BorrowSummary />} />
              </Routes>
            </div>
          </Content>
          <AppFooter />
          <Toaster position="top-right" />
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
