import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Signin from './Signin';
import Signup from './Signup';

import SocialLogin from './SocialLogin';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sociallogin" element={<SocialLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
