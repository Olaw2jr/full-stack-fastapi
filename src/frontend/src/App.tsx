import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/organism/theme-provider";
import { lazy } from "react";

const LoginPage = lazy(async () => import("@/pages/LoginPage"));
const RegisterPage = lazy(async () => import("@/pages/RegisterPage"));
const DashboardPage = lazy(async () => import("@/pages/DashboardPage"));

const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="Full-Stack-FastAPI">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
