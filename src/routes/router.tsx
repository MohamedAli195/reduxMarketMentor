import PageLoader from 'components/Shared/loading/PageLoader';
import Splash from 'components/Shared/loading/Splash';
import AuthLayout from 'layouts/auth-layout';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import paths, { rootPaths } from './path';
import ProtectedRoute from 'components/protectedRoute/ProtectedRoute';
import SkeletonTables from 'components/Shared/skelton';
import { store } from 'app/store';

const App = lazy(() => import('App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const Dashboard = lazy(() => import('pages/dashboard/index'));
const CategoriesPage = lazy(() => import('pages/categories'));
const CustomersPage = lazy(() => import('pages/customers'));
const OrdersPage = lazy(() => import('pages/orders'));
const CoursesPage = lazy(() => import('pages/courses'));
const AddCoursePage = lazy(() => import('pages/courses/AddCoursePage'));
const PermissionsPage = lazy(() => import('pages/permissions'));
const RecommendationsPage = lazy(() => import('pages/recommendationsPage'));
const SubAdminsPage = lazy(() => import('pages/subadmins'));
const SubAdminDetails = lazy(() => import('pages/subadmins/subADminDetails'));
const InboxPage = lazy(() => import('pages/inbox'));
const PackagesPage = lazy(() => import('pages/packages'));
const PackageDetails = lazy(() => import('pages/packages/PackageDetails'));
const CategoriesDetails = lazy(() => import('pages/categories/CategoriesDetails'));
const CourseDetails = lazy(() => import('pages/courses/CourseDetails'));
const CourseUpdate = lazy(() => import('pages/courses/CourseUpdate'));
const LectuerDetails = lazy(() => import('components/lectuerTable/LectuerDetails'));
const ViewCustomer = lazy(() => import('components/Customers/ViewCustomer'));
const RecommendationsDetails = lazy(
  () => import('pages/recommendationsPage/recommendationsDetails'),
);
const LoginPage = lazy(() => import('pages/authentication/login'));
const SignUpPage = lazy(() => import('pages/authentication/register'));
const ForgotPasswordPage = lazy(() => import('pages/authentication/forgot-password'));
const PasswordResetPage = lazy(() => import('pages/authentication/reset-password'));
const NotFoundPage = lazy(() => import('pages/not-found'));
const token = store.getState().auth.authData.token;
// console.log("isLoggedIn",isLoggedIn)
export const routes = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.default,

        element: (
          <Suspense fallback={<PageLoader />}>
            <MainLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,

            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.categories,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                <ProtectedRoute redirect={paths.login}>
                  <CategoriesPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          // {
          //   path: paths.products,
          //   element: (
          //     <ProtectedRoute  redirect={paths.login}>
          //       <ProductsPage />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: paths.customers,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                <ProtectedRoute redirect={paths.login}>
                  <CustomersPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: paths.orders,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                <ProtectedRoute redirect={paths.login}>
                  <OrdersPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: paths.courses,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <CoursesPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: `${paths.courses}/add`,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <AddCoursePage />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.permissions,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <PermissionsPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.recommendations,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <RecommendationsPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.subAdmins,
            element: (
              <Suspense fallback={<SkeletonTables />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <SubAdminsPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: `${paths.subAdmins}/:id`, // Fixed typo
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <SubAdminDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.inbox,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <InboxPage />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.packages, // Fixed typo
            element: (
              <Suspense fallback={<SkeletonTables />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <PackagesPage isDashBoard={false} />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: `${paths.packages}/:id`, // Fixed typo
            element: (
              <Suspense fallback={<PageLoader />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <PackageDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: `${paths.categories}/:id`, // Fixed typo
            element: (
              <Suspense fallback={<PageLoader />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <CategoriesDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: `${paths.courses}/:id`, // Fixed typo
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <CourseDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },

          {
            path: `${paths.courses}/update/:id`, // Fixed typo
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <CourseUpdate />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: `${paths.lectuers}/:id`, // Fixed typo
            element: (
              <Suspense fallback={<PageLoader />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <LectuerDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          // {
          //   path: `${paths.lectuers}/update/:id`, // Fixed typo
          //   element: (
          //     <ProtectedRoute  redirect={paths.login}>
          //       <UpdateLectuerForm />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: `${paths.customers}/:id`,
            element: (
              <Suspense fallback={<PageLoader />}>
                {' '}
                <ProtectedRoute redirect={paths.login}>
                  <ViewCustomer />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: `${paths.recommendations}/:id`,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute redirect={paths.login}>
                  <RecommendationsDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            element: (
              <Suspense fallback={<PageLoader />}>
                {' '}
   
               <LoginPage />
           
                
              </Suspense>
            ),
          },
          {
            path: paths.signup,
            element: (
              <Suspense fallback={<PageLoader />}>
                {' '}
                <ProtectedRoute redirect={paths.default}>
                  <SignUpPage />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: paths.forgotPassword,
            element: <ForgotPasswordPage />,
          },
          {
            path: paths.resetPassword,
            element: <PasswordResetPage />,
          },
        ],
      },
      {
        path: rootPaths.errorRoot,
        children: [
          {
            path: paths.notFound,
            element: <NotFoundPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={paths.notFound} replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/',
});

export default router;
