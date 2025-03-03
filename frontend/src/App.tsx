import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthProvider } from "@/components/auth/AuthContext";
import SmartNavbar from "./components/navigation/SmartNavbar";
import LandingPage from "@/pages/Homepage";
import NotFoundPage from "@/pages/NotFound";
import AboutUs from "@/pages/AboutUs";
import ProfilePage from "@/pages/Profile";
import Explore from "@/pages/Explore";
import MyRecipes from "@/pages/MyRecipes";
import CreateRecipe from "@/pages/CreateRecipe";
import SignupPage from "@/pages/SingupPage";
import LoginPage from "@/pages/LoginPage";
import Footer from "./components/footer";

const App = () => {
  const [backendMessage, setBackendMessage] = useState<string>("");

  useEffect(() => {
    axios
      .get<{ message: string }>("http://localhost:5000/api/test") // Backend URL
      .then((response) => {
        setBackendMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <SmartNavbar />

          <main className="flex-grow">
            {/* แสดงข้อความจาก Backend (เช็คว่าเชื่อมต่อสำเร็จหรือไม่) */}
            {backendMessage && (
              <div className="bg-green-100 text-green-700 p-2 text-center">
                {backendMessage}
              </div>
            )}

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recipes/explore" element={<Explore />} />
              <Route path="/recipes/my-recipes" element={<MyRecipes />} />
              <Route path="/recipe/create" element={<CreateRecipe />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
