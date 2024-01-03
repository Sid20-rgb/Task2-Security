import React, { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import BlogDetails from "./pages/BlogDetails";
import CommentPage from "./pages/CommentPage";
import IndividualPage from "./pages/IndividualPage";
import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import UpdateBlogPage from "./pages/UpdateBlogPage";
import UpdateProfile from "./pages/UpdateProfile";
import UploadPage from "./pages/UploadPage";

function App() {
  const { user, setUser } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <MainPage /> : <SignupPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/homepage" /> : <SigninPage />}
        />
        <Route
          path="/homepage"
          element={user ? <MainPage /> : <Navigate to="/" />}
        />
        <Route path="/uploadpage" element={<UploadPage />} />
        <Route path="/update/:blogId" element={<UpdateBlogPage />} />
        <Route
          path="/updateprofile"
          element={user ? <UpdateProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/individualpage"
          element={user ? <IndividualPage /> : <Navigate to="/" />}
        />
        <Route path="/commentpage" element={<CommentPage />} />
        <Route path="/blogDetails" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
