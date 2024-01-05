export const verifyAdminPermissions = (authCtx) => {
  if (authCtx?.user?.role === 'super_admin' || authCtx?.user?.role === 'admin') {
    return true;
  } else {
    return false;
  }
};
