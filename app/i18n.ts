export const t = (key: string) => {
  const dict: Record<string, string> = {
    'auth.login': 'Login',
    'auth.email': 'Email or Employee code',
    'auth.password': 'Password',
    'auth.forgot': 'Forgot Password?',
    'home.welcome': 'Welcome',
    'attendance.checkin': 'Check In',
    'attendance.checkout': 'Check Out',
    // add more keys as needed
  };
  return dict[key] ?? key;
};

export default { t };
