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
import ErrorPage from "./pages/ErrorPage";
import IndividualPage from "./pages/IndividualPage";
import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import UpdateBlogPage from "./pages/UpdateBlogPage";
import UpdateProfile from "./pages/UpdateProfile";
import UploadPage from "./pages/UploadPage";
import ForgetPasswordPage from "./pages/ForgetPassword";


function App() {
  const { user, setUser } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <SigninPage />}
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/please-signin" element={<ErrorPage />} />
        {/* <Route
          path="/homepage"
          element={user ? <MainPage /> : <Navigate to="/" />}
        /> */}
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
        <Route path="/forgotPassword" element={<ForgetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
