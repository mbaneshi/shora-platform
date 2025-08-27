import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${language === 'persian' ? 'rtl' : 'ltr'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ش</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {language === 'persian' ? 'ثبت نام در سیستم' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {language === 'persian' ? 'پلتفرم شورای شهر بانشی' : 'Baneshi City Council Platform'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="form-label">
                  {language === 'persian' ? 'نام' : 'First name'}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="form-input"
                  placeholder={language === 'persian' ? 'نام خود را وارد کنید' : 'Enter your first name'}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="form-label">
                  {language === 'persian' ? 'نام خانوادگی' : 'Last name'}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="form-input"
                  placeholder={language === 'persian' ? 'نام خانوادگی خود را وارد کنید' : 'Enter your last name'}
                />
              </div>
            </div>

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
              <label htmlFor="phone" className="form-label">
                {language === 'persian' ? 'شماره تلفن' : 'Phone number'}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="form-input"
                placeholder={language === 'persian' ? '09123456789' : '09123456789'}
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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                {language === 'persian' ? 'تکرار رمز عبور' : 'Confirm password'}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="form-input pr-10"
                  placeholder={language === 'persian' ? 'رمز عبور خود را تکرار کنید' : 'Confirm your password'}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="mr-2 block text-sm text-gray-900">
                {language === 'persian' 
                  ? 'موافقم با شرایط و قوانین استفاده'
                  : 'I agree to the terms and conditions'
                }
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn btn-primary"
              >
                {language === 'persian' ? 'ثبت نام' : 'Create account'}
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

export default Register;
