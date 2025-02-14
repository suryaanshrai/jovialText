import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";
import PositivePosts from "./pages/PositivePosts";
import Following from "./pages/Following";
import Liked from "./pages/Liked";
import Notifications from "./pages/Notifications";

export default function JovialRouter() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="" element={<App />}>
                <Route path="" element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path="positive-posts" element={<PositivePosts />} />
                <Route path="following" element={<Following/>} />
                <Route path="liked" element={<Liked/>} />
                <Route path="notifications" element={<Notifications/>} />
              </Route>
              <Route path="auth/google" element={<App />} />
            </Routes>
        </BrowserRouter>
    )
}