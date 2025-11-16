import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import QuotePage from "./pages/QuotePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import CallbackPage from "./pages/CallbackPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 홈 */}
                <Route path="/" element={<HomePage />} />
                
                {/* 회사소개 */}
                <Route path="/about" element={<AboutPage />} />
                
                {/* 견적문의 */}
                <Route path="/quote" element={<QuotePage />} />
                
                {/* 상품 상세 페이지 */}
                <Route path="/product/:id" element={<ProductDetailPage />} />
                
                {/* 로그인 페이지 (로그인한 사용자는 접근 불가) */}
                <Route
                    path="/login"
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <LoginPage />
                        </ProtectedRoute>
                    }
                />
                
                {/* OAuth 콜백 페이지 */}
                <Route
                    path="/callback/:provider"
                    element={
                        <ProtectedRoute requireAuth={false}>
                            <CallbackPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;