
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
