import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./utils/authentication/AuthProvider"; // global authentication context

// Pages
import Index from "./pages/Index/Index";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Faq from "./pages/Faq/Faq";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";

import PasswordReset from "./pages/PasswordReset/PasswordReset";
import PasswordConfirm from "./pages/PasswordConfirm/PasswordConfirm";

import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import EmailConfirm from "./pages/EmailConfirm/EmailConfirm";
import VerifyRequest from "./pages/VerifyRequest/VerifyRequest";

import ProtectedRoute from "./utils/authentication/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

import VendorLayout from "./pages/VendorDashboard/VendorLayout";
import VendorDashboard from "./pages/VendorDashboard/VendorDashboard";
import VendorOrders from "./pages/VendorDashboard/VendorOrders";
import VendorNewsletter from "./pages/VendorDashboard/VendorNewsletter";
import VendorAccounts from "./pages/VendorDashboard/VendorAccounts";
import VendorFinances from "./pages/VendorDashboard/VendorFinances";
import VendorProducts from "./pages/VendorDashboard/VendorProducts";
import VendorAddProducts from "./pages/VendorDashboard/VendorAddProducts";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* common route */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />

          {/* general auth routes */}
          <Route
            path="/account/login"
            element={<Login initialMethod="login" />}
          />
          <Route
            path="/account/register"
            element={<Login initialMethod="register" />}
          />
          <Route path="/account/password/recover" element={<PasswordReset />} />
          <Route
            path="/account/verification/resend"
            element={<VerifyRequest />}
          />

          {/* redirect from email auth routes */}
          <Route
            path="/account/verify-email/:email"
            element={<VerifyEmail />}
          />
          <Route
            path="/account/password-reset/confirm/:uid/:token"
            element={<PasswordConfirm />}
          />
          <Route
            path="/account/confirm-email/:uid/:token"
            element={<EmailConfirm />}
          />

          {/* protected vendor routes */}
          <Route element={<ProtectedRoute vendorOnly={true} />}>
            <Route path="/vendor-dashboard" element={<VendorLayout />}>
              <Route index element={<VendorDashboard />} />
              <Route
                path="/vendor-dashboard/orders"
                element={<VendorOrders />}
              />
              <Route
                path="/vendor-dashboard/newsletter"
                element={<VendorNewsletter />}
              />
              <Route
                path="/vendor-dashboard/accounts"
                element={<VendorAccounts />}
              />
              <Route
                path="/vendor-dashboard/finances"
                element={<VendorFinances />}
              />
              <Route
                path="/vendor-dashboard/products"
                element={<VendorProducts />}
              />
              <Route
                path="/vendor-dashboard/products/add"
                element={<VendorAddProducts />}
              />
            </Route>
          </Route>

          {/* auth protected routes */}
          <Route element={<ProtectedRoute vendorOnly={false} />}>
            <Route path="/account/profile" element={<Profile />} />
          </Route>

          {/* if route dne */}
          <Route path="/*" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
