import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${language === 'persian' ? 'rtl' : 'ltr'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ش</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {language === 'persian' ? 'ورود به سیستم' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {language === 'persian' ? 'پلتفرم شورای شهر بانشی' : 'Baneshi City Council Platform'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                {language === 'persian' ? 'ایمیل' : 'Email address'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder={language === 'persian' ? 'example@baneshi.ir' : 'example@baneshi.ir'}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                {language === 'persian' ? 'رمز عبور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="form-input pr-10"
                  placeholder={language === 'persian' ? 'رمز عبور خود را وارد کنید' : 'Enter your password'}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                  {language === 'persian' ? 'مرا به خاطر بسپار' : 'Remember me'}
                </label>
              </div>

              <div className="text-sm">
                <button type="button" className="font-medium text-primary-600 hover:text-primary-500">
                  {language === 'persian' ? 'فراموشی رمز عبور؟' : 'Forgot your password?'}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn btn-primary"
              >
                {language === 'persian' ? 'ورود' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {language === 'persian' ? 'یا' : 'Or'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setLanguage(language === 'persian' ? 'english' : 'persian')}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="mr-2">
                  {language === 'persian' ? '🇺🇸 English' : '🇮🇷 فارسی'}
                </span>
                {language === 'persian' ? 'تغییر زبان' : 'Change Language'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
