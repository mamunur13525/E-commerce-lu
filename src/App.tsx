import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { MobileDock } from './components/common/MobileDock';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/common/Footer';
import { SEO } from './components/common/SEO';
import { LoginModal } from './components/auth/LoginModal';

// Pages
import { HomePage } from './components/pages/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { CategoriesPage } from './components/shop/CategoriesPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrdersPage } from './components/orders/OrdersPage';
import { TrackOrderPage } from './components/orders/TrackOrderPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { AdminPage } from './components/admin/AdminPage';

const MainLayout: React.FC = () => {
  const { currentPage } = useStore();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // If on Admin page, render dedicated full-screen layout without storefront header/footer (Req 9)
  if (currentPage === 'admin') {
    return (
      <>
        <SEO />
        <AdminPage />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'categories':
        return <CategoriesPage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
        return <OrdersPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'contact':
        return <ContactUsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col selection:bg-slate-950 selection:text-white font-sans">
      <SEO />
      {/* Top Main Navigation Bar (Clean centered big search) */}
      <Navbar />

      {/* Dynamic Main Page Content */}
      <main className="flex-1 w-full pb-16 md:pb-0">
        {renderPage()}
      </main>

      {/* Global Streamlined Footer */}
      <Footer />

      {/* Mobile Bottom Touch Navigation */}
      <MobileDock />

      {/* Sidebar Cart Drawer */}
      <CartDrawer />

      {/* Quick View Product Modal */}
      <QuickViewModal />

      {/* Login Modal */}
      <LoginModal />

      {/* Notifications Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}

export default App;
