'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { CheckCircle, Flag  } from 'lucide-react';

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
 // once you complete any step the user does not progress to the next step, this should be automatic once a good response is recieved that the next step is set  , none of them do
 // createAgencyemailverificationcode gets sent automatically for some reason, this should only be called when a user clicks a button on the agency verification section
// if i reload when I am at the agency email verification sectiion it goes to manual approval without verifying my agency email first 
// for phone number entry section ensure that it displays +1 and a USA flag to the left of the input to tell the user not to include the country code

const STEPS = 5;

export default function VerificationPage() {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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
  interface VerificationInfo {
    role: string;
    cardPhoto: File | null;  // Changed from just null to File | null
    fullName: string;
    organization: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  }
  const [verificationInfo, setVerificationInfo] = useState<VerificationInfo>({
    role: '',
    cardPhoto: null,
    fullName: '',
    organization: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const isInitialMount = useRef(true);
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  useEffect(() => {
    if (isInitialMount.current) {
      fetchUserData();
      isInitialMount.current = false;
      return;
    }
  
    if (isInitialLoading) return;
  
    if (!user && !isLoading) {
      router.push('/login');
      return;
    }
  
    if (!user) return;
  
    if (user.isDisabled) {
      router.push('/disabled');
      return;
    }
  
    if (user.isActive) {
      router.push('/dashboard');
      return;
    }

    // Modified step progression logic
    if (!user.emailVerified) {
      setCurrentStep(0);
    } else if (!user.phoneNumber) {
      setCurrentStep(1);
    } else if (!user.phoneVerified) {
      setCurrentStep(2);
    } else if (!user.agencyEmail) {
      setCurrentStep(3);
    } else if (!user.agencyEmailVerified) {
      setCurrentStep(4);
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

  const checkAndHandleDisabledUser = (userData: User) => {
    if (userData.isDisabled) {
      router.push('/disabled');
      return true;
    }
    return false;
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
      if (checkAndHandleDisabledUser(userData)) return;
      setUser(userData);
      
    } catch (err) {
      console.log(err);
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
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          if (checkAndHandleDisabledUser(updatedUser)) return;
          setUser(updatedUser);
          if (updatedUser.emailVerified) {
            setCurrentStep(1);
          }
        }
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
  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setUploadProgress(0);
    
    try {
        // Create form data
        const formData = new FormData();
        
        // Append all form fields
        formData.append('role', verificationInfo.role);
        formData.append('name', verificationInfo.fullName);
        formData.append('companyName', verificationInfo.organization);
        formData.append('streetAddress', verificationInfo.streetAddress);
        formData.append('city', verificationInfo.city);
        formData.append('state', verificationInfo.state);
        formData.append('zipCode', verificationInfo.zipCode);

        // Append the file if it exists
        if (verificationInfo.cardPhoto) {
            formData.append('file', verificationInfo.cardPhoto, 'verification-document.pdf');
        }

        // Create XMLHttpRequest to track progress
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadProgress(Math.round(percentComplete));
            }
        };

        // Create a promise to handle the XHR request
        const uploadPromise = new Promise((resolve, reject) => {
            xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/auth/submitVerificationForm`);
            xhr.withCredentials = true; // Enable credentials

            xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Failed to parse response'));
                    }
                } else {
                    reject(new Error(`HTTP Error: ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network Error'));
            xhr.send(formData);
        });

        // Wait for upload to complete
        const result = await uploadPromise;

        // Handle successful submission
        setSuccessMessage('Verification submitted successfully');
        
        // Update user data and move to next step
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            credentials: 'include'
        });
        
        if (userResponse.ok) {
            const updatedUser = await userResponse.json();
            if (checkAndHandleDisabledUser(updatedUser)) return;
            setUser(updatedUser);
            
            if (updatedUser.verificationSubmitted) {
                setCurrentStep(6);
            }
        }

    } catch (err) {
        console.error('Verification submission error:', err);
        setError(err instanceof Error ? err.message : 'Failed to submit verification');
    } finally {
        setIsLoading(false);
    }
};
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
      <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
      />
  </div>
);

  const handleResendEmail = async () => {
    if (!user || timeRemaining > 0) return;
    await sendVerificationEmail();
  };
  const handlePhoneNumberSubmit = async () => {
    if (phoneNumber.length !== 10) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/setPhoneNumber`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
        credentials: 'include'
      });
      if (response.ok) {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          if (checkAndHandleDisabledUser(updatedUser)) return;
          setUser(updatedUser);
          if (updatedUser.phoneNumber) {
            setCurrentStep(2);
          } else {
            setError('Failed to set phone number. Please try again.');
          }
        }
      } else if (response.status === 409) {
        setError('This phone number is already in use');
      } else if (response.status === 400) {
        setError('This phone number is invalid. Please use a mobile number');
      } else {
        setError('Failed to set phone number. Please try again.');
      }
    } catch (err) {
      console.log(err);
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
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          if (checkAndHandleDisabledUser(updatedUser)) return;
          setUser(updatedUser);
          if (updatedUser.phoneVerified) {
            setCurrentStep(3);
          }
        }
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
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
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          if (checkAndHandleDisabledUser(updatedUser)) return;
          setUser(updatedUser);
          setSuccessMessage('Agency email registered successfully. Click "Verify Email" below to proceed.');
        }
      } else {
        setError('Failed to register agency email. Please try again.');
      }
    } catch (err) {
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
    } catch (err) {
      console.log(err);
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
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          if (checkAndHandleDisabledUser(updatedUser)) return;
          setUser(updatedUser);
          
          if (updatedUser.agencyEmailVerified) {
            if (updatedUser.needsManualApproval) {
              setCurrentStep(5);
            } else {
              setCurrentStep(6);
            }
          } else {
            setError('Agency email verification failed. Please try again.');
          }
        }
      }
    } catch (err) {
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
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include'
        });
        
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          if (checkAndHandleDisabledUser(updatedUser)) return;
          setUser({ ...updatedUser, isActive: true });
          router.push('/dashboard');
        }
      } else {
        setError('Failed to activate account. Please try again.');
      }
    } catch (err) {
      console.log(err);
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
            
            <div className="relative flex items-center mb-4">
              {/* Country code indicator */}
              <div className="absolute left-0 flex items-center pl-3 pointer-events-none">
                <Flag className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-400">+1</span>
              </div>
              
              {/* Modified phone input */}
              <Input
                type="tel"
                placeholder="(555) 555-5555"
                value={phoneNumber}
                onChange={(e) => {
                  // Remove any non-numeric characters
                  const cleaned = e.target.value.replace(/\D/g, '');
                  // Format the phone number
                  let formatted = cleaned;
                  if (cleaned.length >= 3) {
                    formatted = `(${cleaned.slice(0, 3)})${cleaned.length > 3 ? ' ' + cleaned.slice(3, 6) : ''}${cleaned.length > 6 ? '-' + cleaned.slice(6, 10) : ''}`;
                  }
                  setPhoneNumber(cleaned);
                }}
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 pl-16"
                maxLength={14}
              />
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              Enter your 10-digit US phone number without the country code (+1).
            </p>
            
            <Button 
              onClick={handlePhoneNumberSubmit} 
              disabled={isLoading || phoneNumber.length !== 10} 
              className="w-full"
            >
              {isLoading ? 'Submitting...' : 'Submit Phone Number'}
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
              className="w-full text-gray-700"
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
                    Click below to verify this email address.
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentStep(4);
                      sendAgencyVerificationCode();
                    }}
                    disabled={isLoading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                  >
                    {isLoading ? 'Processing...' : 'Verify Email'}
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
                  disabled={isLoading || !agencyEmail} 
                  className="w-full bg-blue-700 hover:bg-blue-800"
                >
                  {isLoading ? 'Submitting...' : 'Submit Agency Email'}
                </Button>
              </>
            )}
            {successMessage && (
              <Alert className="mt-4 bg-green-900 border-green-800 text-green-300">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </>)

      case 5:
        return (
          <>
             
      
      <div className="bg-blue-900 p-4 rounded-md mb-6">
        <p className="text-white text-sm">
          This verification process is required to access sensitive emergency response information. 
          We take security seriously to protect both emergency personnel and the public. 
        </p>
        <p className="text-white text-sm mt-2">
          Your data is extremely important to us. All information will be immediately deleted upon verification.
        </p>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">What is your role?*</label>
          <select 
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            value={verificationInfo.role}
            onChange={(e) => setVerificationInfo(prev => ({ ...prev, role: e.target.value }))}
            required
          >
            <option value="">Select Role</option>
            <option value="firefighter">Firefighter</option>
            <option value="police">Police Officer</option>
            <option value="emt">EMT</option>
            <option value="other">Other</option>
          </select>
        </div>

        {verificationInfo.role === 'other' && (
          <div>
            <label className="block text-white mb-2">Please specify your role:*</label>
            <Input
              type="text"
              className="w-full bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-white mb-2">Upload Agency or State Credentials*</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setVerificationInfo(prev => ({ ...prev, cardPhoto: file }));
            }}
            className="w-full bg-gray-700 border-gray-600 text-white"
            required
          />
          <p className="text-gray-400 text-sm mt-1">Please upload a clear photo of your official credentials</p>
        </div>

        <div>
          <label className="block text-white mb-2">Full Name*</label>
          <Input
            type="text"
            value={verificationInfo.fullName}
            onChange={(e) => setVerificationInfo(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Company / Organization Name*</label>
          <Input
            type="text"
            value={verificationInfo.organization}
            onChange={(e) => setVerificationInfo(prev => ({ ...prev, organization: e.target.value }))}
            className="w-full bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Street Address*</label>
          <Input
            type="text"
            value={verificationInfo.streetAddress}
            onChange={(e) => setVerificationInfo(prev => ({ ...prev, streetAddress: e.target.value }))}
            className="w-full bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">City*</label>
            <Input
              type="text"
              value={verificationInfo.city}
              onChange={(e) => setVerificationInfo(prev => ({ ...prev, city: e.target.value }))}
              className="w-full bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">State*</label>
            <select
              value={verificationInfo.state}
              onChange={(e) => setVerificationInfo(prev => ({ ...prev, state: e.target.value }))}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              required
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white mb-2">Zip Code*</label>
          <Input
            type="text"
            value={verificationInfo.zipCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
              setVerificationInfo(prev => ({ ...prev, zipCode: value }));
            }}
            pattern="[0-9]{5}"
            className="w-full bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-6">
          {isLoading ? 'Submitting...' : 'Submit for Verification'}
        </Button>

        <p className="text-gray-400 text-sm mt-4">
          * Required fields. All information submitted will be kept confidential and used only for verification purposes.
        </p>
        {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
            <ProgressBar progress={uploadProgress} />
            <p className="text-sm text-gray-400 text-center">
                Uploading: {uploadProgress}%
            </p>
        </div>
    )}

    <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full mt-6"
    >
        {isLoading 
            ? uploadProgress > 0 
                ? `Uploading... ${uploadProgress}%`
                : 'Submitting...' 
            : 'Submit for Verification'
        }
    </Button>

    {/* Error and success messages */}
    {error && (
        <Alert className="mt-4 bg-red-900 border-red-800 text-red-300">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )}
    {successMessage && (
        <Alert className="mt-4 bg-green-900 border-green-800 text-green-300">
            <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
    )}
      </form>
          </>
        );
      case 4:
        return  (
          <>
            <CardTitle className="text-xl font-bold text-center text-white mb-4">Verify Agency Email</CardTitle>
            <p className="text-gray-300 mb-2">Verifying email:</p>
            <p className="text-lg font-semibold text-white text-center mb-4">{user?.agencyEmail}</p>
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
              onClick={sendAgencyVerificationCode}
              disabled={timeRemaining > 0 || isLoading}
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