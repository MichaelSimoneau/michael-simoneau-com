import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App'; // App will become a layout/outlet component
import './index.css';
import { ScrollProvider } from './contexts/ScrollContext';
import { GlobalErrorElement } from './layout/GlobalErrorBoundary';

// Import page/route components
import { NotFound } from "./layout/NotFound";
import { Blog } from "./features/blog/components/Blog";
import { BlogPost } from "./features/blog/components/BlogPost";
import { Interview } from "./features/interview/components/Interview";
import { Interview2 } from "./features/interview/components/Interview2";
import { Interview3 } from "./features/interview/components/Interview3";
import { ZeroTruth } from "./features/zero-truth/components/ZeroTruth";
import { FullProfile } from "./pages/FullProfile";
import { CryptoFabric } from "./pages/CryptoFabric";
import { Thth } from "./pages/Thth";
import { Thd } from "./pages/Thd";

// Lazy load main page component
const LazyMainPage = lazy(() => 
  import("./pages/MainPage").then(module => ({
    default: module.MainPage
  }))
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App component will now act as a layout, rendering an Outlet
    errorElement: <GlobalErrorElement />,
    children: [
      {
        index: true, // This makes it the default child route for "/"
        element: (
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white text-center px-4">Initializing Interface...</div>}>
            <ScrollProvider>
              <LazyMainPage />
            </ScrollProvider>
          </Suspense>
        ),
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:postId",
        element: <BlogPost />,
      },
      {
        path: "interview",
        element: <Outlet />,
        children: [
          { index: true, element: <Interview /> },
          { path: "1", element: <Interview /> },
          { path: "2", element: <Interview2 /> },
          { path: "3", element: <Interview3 /> },
        ],
      },
      {
        path: "zero",
        element: <ZeroTruth />,
      },
      {
        path: "profile",
        element: <FullProfile />,
      },
      {
        path: "cryptofabric",
        element: <CryptoFabric />,
      },
      {
        path: "thth",
        element: <Thth />,
      },
      {
        path: "thd",
        element: <Thd />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
