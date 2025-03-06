import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <SmartNavbar />

          <main className="flex-grow">
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
      </AuthProvider>
    </Router>
  );
};

export default App;
