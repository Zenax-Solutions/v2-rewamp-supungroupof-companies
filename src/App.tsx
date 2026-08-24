import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import { PageTransition } from "./components/PageTransition";
import { RouteLoader } from "./components/RouteLoader";
import Home from "./pages/Home";
import About from "./pages/About";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import CompanyList from "./pages/admin/CompanyList";
import CompanyForm from "./pages/admin/CompanyForm";
import PasswordReset from "./pages/admin/PasswordReset";
import BrandList from "./pages/admin/BrandList";
import BrandForm from "./pages/admin/BrandForm";
import CategoryList from "./pages/admin/CategoryList";
import CategoryForm from "./pages/admin/CategoryForm";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import CamyProducts from "./pages/CamyProducts";
import Careers from "./pages/Careers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <Home />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/about" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <About />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/companies" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <Companies />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/companies/:id" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <CompanyDetail />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/contact" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <Contact />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/careers" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <Careers />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/camy-products" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen bg-[#0A0A0C]">
                  <Navigation />
                  <main className="flex-1">
                    <CamyProducts />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/shop" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen">
                  <Navigation />
                  <main className="flex-1">
                    <CamyProducts />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />
            <Route path="/shop/:id" element={
              <PageTransition>
                <div className="flex flex-col min-h-screen">
                  <Navigation />
                  <main className="flex-1">
                    <ProductDetail />
                  </main>
                  <Footer />
                </div>
              </PageTransition>
            } />

            {/* Admin Login Route (public) */}
            <Route path="/admin/login" element={
              <PageTransition>
                <Login />
              </PageTransition>
            } />

            {/* Admin Routes (protected) */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="companies" element={
                <PageTransition>
                  <CompanyList />
                </PageTransition>
              } />
              <Route path="companies/new" element={
                <PageTransition>
                  <CompanyForm />
                </PageTransition>
              } />
              <Route path="companies/:id/edit" element={
                <PageTransition>
                  <CompanyForm />
                </PageTransition>
              } />
              <Route path="brands" element={
                <PageTransition>
                  <BrandList />
                </PageTransition>
              } />
              <Route path="brands/new" element={
                <PageTransition>
                  <BrandForm />
                </PageTransition>
              } />
              <Route path="brands/:id/edit" element={
                <PageTransition>
                  <BrandForm />
                </PageTransition>
              } />
              <Route path="categories" element={
                <PageTransition>
                  <CategoryList />
                </PageTransition>
              } />
              <Route path="categories/new" element={
                <PageTransition>
                  <CategoryForm />
                </PageTransition>
              } />
              <Route path="categories/:id/edit" element={
                <PageTransition>
                  <CategoryForm />
                </PageTransition>
              } />
              <Route path="products" element={
                <PageTransition>
                  <ProductList />
                </PageTransition>
              } />
              <Route path="products/new" element={
                <PageTransition>
                  <ProductForm />
                </PageTransition>
              } />
              <Route path="products/:id/edit" element={
                <PageTransition>
                  <ProductForm />
                </PageTransition>
              } />
              <Route path="password-reset" element={
                <PageTransition>
                  <PasswordReset />
                </PageTransition>
              } />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
