import React, { useState } from 'react';
import { useOnboardingStore } from '../store/useOnboardingStore';

interface OnboardingStep3Props {
  onComplete: () => void;
  onBack: () => void;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ onComplete, onBack }) => {
  const { setUserProfile, completeOnboarding } = useOnboardingStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCreateAccount = () => {
    if (validateForm()) {
      setUserProfile(formData);
      completeOnboarding();
      onComplete();
    }
  };

  const handleSocialLogin = () => {
    // For now, just complete onboarding without profile data
    // In the future, this would integrate with Google/Facebook OAuth
    setUserProfile({
      name: 'User',
      email: '',
      password: '',
    });
    completeOnboarding();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 bg-blue-400 rounded-full" style={{ width: '33%' }}></div>
            <div className="h-1 bg-blue-400 rounded-full" style={{ width: '33%' }}></div>
            <div className="h-1 bg-blue-400 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign up</h2>
            <p className="text-gray-400">Create your SmallTalk2Me account</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleSocialLogin}
              className="w-full py-3 rounded-lg bg-white text-gray-800 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fill="currentColor">
                  G
                </text>
              </svg>
              Google
            </button>
            <button
              onClick={handleSocialLogin}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.name ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.email ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                    errors.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded bg-gray-700 border-gray-600 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree with SmallTalk2Me{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                privacy policy
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                terms
              </a>
            </label>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCreateAccount}
              className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200"
            >
              Create Account
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all duration-200"
            >
              Back
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

