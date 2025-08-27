import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '@/utils';
import { VALIDATION_RULES } from '@/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name) {
      newErrors.name = VALIDATION_RULES.NAME.required;
    } else if (!validateName(formData.name)) {
      newErrors.name = VALIDATION_RULES.NAME.minLength;
    }

    if (!formData.email) {
      newErrors.email = VALIDATION_RULES.EMAIL.required;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = VALIDATION_RULES.EMAIL.pattern;
    }

    if (!formData.password) {
      newErrors.password = VALIDATION_RULES.PASSWORD.required;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = VALIDATION_RULES.PASSWORD.minLength;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              error={errors.name}
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              error={errors.email}
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Create a password"
              error={errors.password}
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 