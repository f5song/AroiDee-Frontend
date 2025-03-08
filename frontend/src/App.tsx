import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";
import SmartNavbar from "./components/navigation/SmartNavbar";
import Footer from "@/components/footer";
import { FavoritesProvider } from "@/components/auth/FavoritesContext";

// Lazy loading components
const LandingPage = lazy(() => import("@/pages/Homepage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const Explore = lazy(() => import("@/pages/Explore"));
const MyRecipes = lazy(() => import("@/pages/MyRecipes"));
const CreateRecipe = lazy(() => import("@/pages/CreateRecipe"));
const SignupPage = lazy(() => import("@/pages/SingupPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const MealPlanner = lazy(() => import("@/pages/CalendarMealPlanner"));
const Recipe = lazy(() => import("@/pages/Recipe"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <div className="flex flex-col min-h-screen">
            <SmartNavbar />

            <main className="flex-grow">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/recipes/explore" element={<Explore />} />
                  <Route path="/recipes/my-recipes" element={<MyRecipes />} />
                  <Route path="/recipe/create" element={<CreateRecipe />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/recipe/:id" element={<Recipe />} />
                  <Route
                    path="/meal-planning/planner"
                    element={<MealPlanner />}
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
