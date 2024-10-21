'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface User {
  id: number;
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  agencyId: number | null;
  agencyEmail: string | null;
  agencyEmailVerified: boolean;
  phoneNumber: string | null;
  phoneVerified: boolean;
  needsManualApproval: boolean;
}

const STEPS = 4;

export default function VerificationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyCode, setAgencyCode] = useState('');
  
  const [phoneCode, setPhoneCode] = useState(['', '', '', '', '', '', '']);
  const phoneInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [manualVerificationInfo, setManualVerificationInfo] = useState({
    cardPhoto: null as File | null,
    workIdPhoto: null as File | null,
    name: '',
    reason: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: 'include'
      });
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const userData: User = await response.json();
      setUser(userData);
      if (userData.isActive) {
        router.push('/dashboard');
      } else if (userData.needsManualApproval) {
        router.push('/manual-approval');
      } else {
        determineStartingStep(userData);
      }
    } catch (err) {
      setError('Failed to fetch user data. Please try again.');
    }
  };

  useEffect(() => {
    phoneInputRefs.current = phoneInputRefs.current.slice(0, 7);
  }, []);

  const determineStartingStep = (userData: User) => {
    if (!userData.emailVerified) {
      setCurrentStep(0);
    } else if (!userData.phoneVerified) {
      setCurrentStep(1);
    } else {
      setCurrentStep(2);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full flex justify-between mb-6">
        {[...Array(STEPS)].map((_, index) => (
          <div key={index} className="w-1/5 h-2 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full ${index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'} transition-all duration-300 ease-in-out`}
              style={{ width: index <= currentStep ? '100%' : '0%' }}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  const handleEmailVerification = async () => {
    if (emailCode.length !== 7) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyPersonalCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailCode }),
        credentials: 'include'
      });
      if (response.ok) {
        setCurrentStep(1);
      } else if (response.status === 400) {
        setError('Invalid code. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
        credentials: 'include'
      });
      setError('Email resent. Please check your inbox.');
    } catch (err) {
      setError('Failed to resend email. Please try again.');
    }
  };

  const handlePhoneCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...phoneCode];
    newCode[index] = value;
    setPhoneCode(newCode);
    if (value !== '' && index < 6) {
      phoneInputRefs.current[index + 1]?.focus();
    }
  };
  
  const handlePhoneCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && phoneCode[index] === '' && index > 0) {
      phoneInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePhoneVerification = async () => {
    const code = phoneCode.join('');
    if (code.length !== 7) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/checkPhoneNumber`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });
      if (response.ok) {
        setCurrentStep(2);
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgencyEmailSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/setAgencyEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: agencyEmail }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.emailValid === false) {
        setCurrentStep(3);
      } else if (data.emailValid === true) {
        setCurrentStep(4);
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerificationSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (manualVerificationInfo.cardPhoto) {
        formData.append('cardPhoto', manualVerificationInfo.cardPhoto);
      }
      if (manualVerificationInfo.workIdPhoto) {
        formData.append('workIdPhoto', manualVerificationInfo.workIdPhoto);
      }
      formData.append('name', manualVerificationInfo.name);
      formData.append('reason', manualVerificationInfo.reason);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyInformation`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (response.ok) {
        setError('Your information has been submitted and will be reviewed. You will receive an email with an update soon.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgencyCodeVerification = async () => {
    if (agencyCode.length !== 7) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyAgencyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: agencyCode }),
        credentials: 'include'
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Email Verification</CardTitle>
            <Input
              type="text"
              placeholder="Enter 7-digit code"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
              onKeyUp={() => emailCode.length === 7 && handleEmailVerification()}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <Button onClick={handleResendEmail} className="w-full mt-2">
              Didn't get your email? Resend it
            </Button>
          </>
        );
      case 1:
        return (
            <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Phone Verification</CardTitle>
            <p className="text-gray-300 mb-4">Enter the 7-digit code sent to your phone:</p>
            <div className="flex justify-between mb-4">
              {phoneCode.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handlePhoneCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handlePhoneCodeKeyDown(index, e)}
                  ref={(el) => {
                    phoneInputRefs.current[index] = el;
                  }}
                  className="w-10 h-12 text-center bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                  maxLength={1}
                />
              ))}
            </div>
            <Button onClick={handlePhoneVerification} disabled={phoneCode.join('').length !== 7 || isLoading} className="w-full">
              Verify Phone Number
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Agency Verification</CardTitle>
            <p className="text-gray-300 mb-4">Please enter your official agency email address. This is needed to prevent fraud and access sensitive information.</p>
            <Input
              type="email"
              placeholder="Agency Email"
              value={agencyEmail}
              onChange={(e) => setAgencyEmail(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <Button onClick={handleAgencyEmailSubmit} disabled={isLoading} className="w-full">
              Submit Agency Email
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Manual Verification</CardTitle>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setManualVerificationInfo(prev => ({ ...prev, cardPhoto: file }));
              }}
              className="w-full bg-gray-700 border-gray-600 text-white mb-4"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setManualVerificationInfo(prev => ({ ...prev, workIdPhoto: file }));
              }}
              className="w-full bg-gray-700 border-gray-600 text-white mb-4"
            />
            <Input
              type="text"
              placeholder="Full Name"
              value={manualVerificationInfo.name}
              onChange={(e) => setManualVerificationInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <textarea
              placeholder="Why do you want access?"
              value={manualVerificationInfo.reason}
              onChange={(e) => setManualVerificationInfo(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4 p-2 rounded-md"
              rows={4}
            />
            <Button onClick={handleManualVerificationSubmit} disabled={isLoading} className="w-full">
              Submit for Review
            </Button>
          </>
        );
      case 4:
        return (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Agency Email Verification</CardTitle>
            <p className="text-gray-300 mb-4">Please check your agency email and enter the 7-digit code sent to you.</p>
            <Input
              type="text"
              placeholder="Enter 7-digit code"
              value={agencyCode}
              onChange={(e) => setAgencyCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
              onKeyUp={() => agencyCode.length === 7 && handleAgencyCodeVerification()}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
          </>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <Shield className="h-12 w-12 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">NYC Incident Dashboard</CardTitle>
          {renderProgressBar()}
        </CardHeader>
        <CardContent>
          {renderStep()}
          {error && (
            <Alert variant="destructive" className="mt-4 bg-red-900 border-red-800 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-400 mt-2 w-full">
            This is a secure verification process for official access to the NYC Incident Dashboard.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}