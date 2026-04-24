// Google login ke liye backend redirect
export const googleLogin = () => {
 window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
};
