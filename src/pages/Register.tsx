
import React from 'react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
