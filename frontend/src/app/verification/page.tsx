'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

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
  isDisabled: boolean;
}
 // IMPORTANT MAKE SURE IT MOVES TO NEXT STEP ON EMAIL VERIFICATION PERHAPS ADD A BUTTON
 // email and phone dont progress to the next page on click , none of them do
 // createAgencyemailverificationcode gets sent automatically for some reason???
// very buggy need to address this
// if i reload it goes to manual approval without verifying my agency email first thats weird
const STEPS = 5;

export default function VerificationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [emailCode, setEmailCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyCode, setAgencyCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [phoneCode, setPhoneCode] = useState(['', '', '', '', '', '', '']);
  const phoneInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [manualVerificationInfo, setManualVerificationInfo] = useState({
    cardPhoto: null as File | null,
    workIdPhoto: null as File | null,
    name: '',
    reason: ''
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchUserData();
      isInitialMount.current = false;
      return; // Don't proceed with other checks during initial mount
    }

    // Skip redirects if we're still loading
    if (isInitialLoading) {
      return;
    }

    // Only redirect to login if we're not in the middle of loading and user is null
    if (!user && !isLoading) {
      router.push('/login');
      return;
    }

    // Skip the rest if user is null
    if (!user) {
      return;
    }
    if (user.isDisabled) {
      router.push('/disabled');
      return; // Prevent further execution
    }
    if (user.isActive) {
      router.push('/dashboard');
      return;
    }
    
    if (user.needsManualApproval) {
      router.push('/manual-approval');
      return;
    }

    // Only set step if user exists and we're not redirecting
    if (!user.emailVerified) {
      setCurrentStep(0);
    } else if (!user.phoneNumber) {
      setCurrentStep(1);
    } else if (!user.phoneVerified) {
      setCurrentStep(2);
    } else if (!user.agencyEmailVerified) {
      setCurrentStep(3);
    } else if (user.needsManualApproval) {
      setCurrentStep(5);
    } else {
      setCurrentStep(6);
    }
  }, [user, isInitialLoading, isLoading]);


  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sendPersonalEmail`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }
      setEmailSent(true); // Set emailSent to true when email is sent
      setSuccessMessage('Verification email has been sent. Please check your email.'); // Set success message
      setTimeRemaining(60); // Start the timer
    } catch (err) { console.log(err)
      console.log(err)
      setError('Failed to send verification email. Please try again.');
    }
  };

  const fetchUserData = async () => {
    setIsInitialLoading(true);
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
      
    } catch (err) { console.log(err)
      setError('Failed to fetch user data. Please try again.');
      router.push('/login');
    } finally {
      setIsInitialLoading(false);
    }
  };

  
  // Remove determineStartingStep function

  const renderProgressBar = () => {
    return (
      <div className="w-full flex justify-between mb-6">
        {[...Array(STEPS)].map((_, index) => (
          <div key={index} className="w-1/6 h-2 bg-gray-600 rounded-full overflow-hidden">
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
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user || timeRemaining > 0) return;
    await sendVerificationEmail();
  };

  const handlePhoneNumberSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/setPhoneNumber`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
        credentials: 'include'
      });
      if (response.ok) {
        setCurrentStep(2);
      } else {
        setError('Failed to set phone number. Please try again.');
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyPhoneCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include'
      });
      if (response.ok) {
        setCurrentStep(3);
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendPhoneCode = async () => {
    if (timeRemaining > 0) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resendCode`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        setSuccessMessage('New verification code has been sent to your phone.');
        setTimeRemaining(60); // Start the cooldown timer
      } else {
        setError('Failed to resend verification code. Please try again.');
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleAgencyEmailSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/setAgencyEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: agencyEmail }),
        credentials: 'include'
      });
      
      if (response.status === 409) {
        setError('This agency email is already registered. Please use a different email or contact support.');
        return;
      }
      
      if (response.ok) {
        setUser(prev => prev ? { ...prev, agencyEmail: agencyEmail } : prev);
        sendAgencyVerificationCode(); // Call directly instead of showing another button
      } else {
        setError('Failed to register agency email. Please try again.');
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const sendAgencyVerificationCode = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/createAgencyEmailVerificationCode`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        setEmailSent(true);
        setSuccessMessage('Verification code has been sent to your agency email.');
        setTimeRemaining(60);
        setCurrentStep(4);
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerificationSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(manualVerificationInfo).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyInformation`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        setSuccessMessage('Your information has been submitted and will be reviewed. You will receive an email with an update soon.');
        router.push('/manual-approval');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAgencyCodeVerification = async () => {
    if (agencyCode.length !== 7) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyAgencyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: agencyCode }),
        credentials: 'include'
      });
  
      if (response.status === 400) {
        setError('Invalid verification code. Please try again.');
        return;
      }
  
      if (response.ok) {
        // Single request to get updated user data
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        
        if (userResponse.ok) {
          const userData: User = await userResponse.json();
          setUser(userData);
          
          if (!userData.agencyEmailVerified) {
            setError('Agency email verification failed. Please try again.');
            return;
          }
  
          // No need for another request, use the userData we already have
          if (userData.needsManualApproval) {
            setCurrentStep(5);
          }
        }
      }
    } catch (err) { console.log(err)
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDashboardRedirect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/setActive`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Update user state before redirect
        const updatedUser = { ...user!, isActive: true };
        setUser(updatedUser);
        router.push('/dashboard');
      } else {
        setError('Failed to activate account. Please try again.');
      }
    } catch (err) { console.log(err)
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
            {!emailSent ? (
              <div className="flex justify-center">
                <Button
                  onClick={sendVerificationEmail}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >
                  Send Verification Email
                </Button>
              </div>
            ) : (
              <>
                {successMessage && (
                  <Alert className="mb-4 bg-green-900 border-green-800 text-green-300">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                <Input
                  type="text"
                  placeholder="Enter 7-digit code"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
                  onKeyUp={() => emailCode.length === 7 && handleEmailVerification()}
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
                />
                <Button
                  onClick={handleResendEmail}
                  className="w-full mt-2"
                  disabled={timeRemaining > 0}
                >
                  {timeRemaining > 0
                    ? `Resend email in ${timeRemaining}s`
                    : "Didn't get your email? Resend it"}
                </Button>
              </>
            )}
          </>
        );
      case 1:
        return (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Phone Number Entry</CardTitle>
            <p className="text-gray-300 mb-4">Please enter your phone number. We need your phone to prevent fraud and abuse.</p>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <p className="text-sm text-gray-400 mb-4">By entering your phone number, you agree to receive a one-time text message to verify your number.</p>
            <Button onClick={handlePhoneNumberSubmit} disabled={isLoading} className="w-full">
              Submit Phone Number
            </Button>
          </>
        );
      case 2:
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
            <Button 
              onClick={handlePhoneVerification} 
              disabled={phoneCode.join('').length !== 7 || isLoading} 
              className="w-full mb-4"
            >
              Verify Phone Number
            </Button>
            <Button
              onClick={handleResendPhoneCode}
              disabled={timeRemaining > 0 || isLoading}
              variant="outline"
              className="w-full"
            >
              {timeRemaining > 0
                ? `Resend code in ${timeRemaining}s`
                : "Didn't receive the code? Resend it"}
            </Button>
          </>
        );
        case 3:
          return (
            <>
              <CardTitle className="text-xl font-bold text-center text-white mb-4">Agency Email Verification</CardTitle>
              {user?.agencyEmail ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-300 mb-2">Your agency email:</p>
                    <p className="text-lg font-semibold text-white mb-4">{user.agencyEmail}</p>
                    <p className="text-gray-300 mb-4">
                      Click below to receive a verification code at your agency email address. 
                      Please check your inbox (and spam folder) for the verification email.
                    </p>
                    <Button
                      onClick={sendAgencyVerificationCode}
                      disabled={isLoading}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                    >
                      Send Verification Email
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300 mb-4">Please enter your official agency email address.</p>
                  <Input
                    type="email"
                    placeholder="Agency Email"
                    value={agencyEmail}
                    onChange={(e) => setAgencyEmail(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  />
                  <Button 
                    onClick={handleAgencyEmailSubmit} 
                    disabled={isLoading} 
                    className="w-full bg-blue-700 hover:bg-blue-800"
                  >
                    Submit Agency Email
                  </Button>
                </>
              )}
              {successMessage && (
                <Alert className="mt-4 bg-green-900 border-green-800 text-green-300">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
            </>
          );
      case 5:
        return (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Manual Verification Required</CardTitle>
            <p className="text-gray-300 mb-4">Your account requires manual verification. Please submit the following information for review:</p>
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
        return  (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Verify Agency Email</CardTitle>
            <p className="text-gray-300 mb-4">Please enter the 7-digit verification code sent to your agency email.</p>
            <Input
              type="text"
              placeholder="Enter 7-digit code"
              value={agencyCode}
              onChange={(e) => setAgencyCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
              onKeyUp={() => agencyCode.length === 7 && handleAgencyCodeVerification()}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <Button
              onClick={() => sendAgencyVerificationCode()}
              disabled={timeRemaining > 0}
              className="w-full mt-2"
            >
              {timeRemaining > 0
                ? `Resend code in ${timeRemaining}s`
                : "Didn't receive the code? Resend it"}
            </Button>
          </>
        );
        case 6:
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <CardTitle className="text-xl font-bold text-white mb-4">Verification Complete</CardTitle>
      <p className="text-gray-300 mb-6">
        Thank you for completing the verification process. Your account has been successfully verified for access to the NYC Incident Dashboard.
      </p>
      <Button 
        onClick={handleDashboardRedirect}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? 'Activating Account...' : 'Continue to Dashboard'}
      </Button>
    </div>
  );
default:
  return null;
    }
 
}
if (isInitialLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    </div>
  );
}
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <Card className="w-full max-w-md bg-gray-800 text-white">
      <CardContent className="p-6">
        {renderProgressBar()}
        {error && (
          <Alert className="mb-4 bg-red-900 border-red-800 text-red-300">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {renderStep()}
      </CardContent>
    </Card>
  </div>
);
}