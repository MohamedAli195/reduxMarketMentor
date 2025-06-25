export const rootPaths = {
  root: '/',
  pagesRoot: '/',
  authRoot: '/authentication',
  errorRoot: '/error',
};

/**
 * Object containing various paths used in the application.
 */
const paths = {
  default: `${rootPaths.root}`,
  categories: `${rootPaths.pagesRoot}categories`,
  packages: `${rootPaths.pagesRoot}packages`,
  products: `${rootPaths.pagesRoot}products`,
  customers: `${rootPaths.pagesRoot}customers`,
  lectuers: `${rootPaths.pagesRoot}lectuers`,
  orders: `${rootPaths.pagesRoot}orders`,
  reports: `${rootPaths.pagesRoot}reports`,
  courses: `${rootPaths.pagesRoot}courses`,
  permissions: `${rootPaths.pagesRoot}permissions`,
  recommendations: `${rootPaths.pagesRoot}recommendations`,
  subAdmins: `${rootPaths.pagesRoot}sub-admins`,
  inbox: `${rootPaths.pagesRoot}inbox`,
  login: `${rootPaths.authRoot}/login`,
  signup: `${rootPaths.authRoot}/sign-up`,
  forgotPassword: `${rootPaths.authRoot}/forgot-password`,
  resetPassword: `${rootPaths.authRoot}/reset-password`,
  notFound: `${rootPaths.errorRoot}/404`,
};

export default paths;
