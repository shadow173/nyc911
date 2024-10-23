'use client'
import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, ScrollText, ExternalLink, UserX, FileWarning } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const SecurityGuidelinesModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <AlertDialogTitle className="text-xl font-bold">Critical Security Guidelines & Access Restrictions</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400">
            INCIDENTSNYC Information Security Policy Framework - Version 2024.1
            <br />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5" />
              CRITICAL: Account Sharing Prohibition
            </h3>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="font-medium text-red-300">
                NOTICE: Sharing access credentials or allowing unauthorized users to access this system is STRICTLY PROHIBITED 
                and constitutes a serious security violation.
              </p>
              <div className="bg-gray-900/50 p-3 rounded border border-red-800">
                <h4 className="text-red-400 font-medium mb-2">Zero Tolerance Policy:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Immediate account suspension upon detection of shared access</li>
                  <li>Mandatory security audit of all associated accounts</li>
                  <li>Permanent access revocation for repeated violations</li>
                </ul>
              </div>
            </div>
          </div>

          

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Strictly Prohibited Security Processes
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-red-400 mb-2">Account & Access Violations:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                  <li>Sharing login credentials with ANY other individual</li>
                  <li>Using another person's credentials or access tokens</li>
                  <li>Attempting to access the system using multiple accounts</li>
                  <li>Maintaining concurrent active sessions from different locations</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-red-400 mb-2">System Security Violations:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                  <li>Attempting to bypass system security measures</li>
                  <li>Disabling or interfering with security monitoring</li>
                  <li>Using unauthorized VPNs or proxy services</li>
                  <li>Accessing system from unsecured networks</li>
                  <li>Installing unauthorized software or extensions</li>
                </ul>
              </div>

              
            </div>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
            <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5" />
              Automated Security Monitoring
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>The following security measures are actively enforced:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Concurrent session detection and prevention</li>
                <li>Behavioral analysis and anomaly detection</li>
                <li>Device fingerprinting and validation</li>
                <li>Access pattern monitoring and analysis</li>
                <li>Automated threat response and containment</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2 mb-3">
              <FileWarning className="h-5 w-5" />
              Violation Consequences
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>Security violations may result in:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Immediate system access suspension</li>
                <li>Comprehensive security investigation</li>
                <li>Permanent access privilege revocation</li>
                <li>Criminal prosecution under 18 U.S.C. § 1030</li>
                <li>Civil penalties and legal action</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-gray-400 space-y-2">
            <p className="font-medium">
              <strong className="text-red-400">IMPORTANT:</strong> By accessing this system, you acknowledge these security requirements and agree to comply with all stated policies and procedures.
            </p>
         
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="border-gray-600 text-gray-700 hover:bg-gray-700">
            Close
          </AlertDialogCancel>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.print()}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Guidelines
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AccountDisabledPage = () => {
  const [showGuidelines, setShowGuidelines] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-4">
            <Shield className="h-12 w-12 text-red-500" />
            <Lock className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">Account Access Restricted</CardTitle>
          <p className="text-center text-sm text-red-400">NOTICE OF SUSPENSION</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="bg-red-900/50 border-red-800">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-200">Critical Security Alert</AlertTitle>
            <AlertDescription className="text-red-200">
              Account access has been suspended due to possible fraudulent or suspicious activity.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 text-gray-300">
            <p className="text-sm leading-relaxed">
              Pursuant to <span className="font-mono text-blue-400">18 U.S.C. § 1030</span> (Computer Fraud and Abuse Act), your account access has been 
              suspended due to detected anomalies that may indicate unauthorized access attempts or suspicious activity patterns.
            </p>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Security Notice</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Access is restricted to authorized emergency management personnel and responders</li>
                <li>Sharing accounts or sharing credentials with anyone else is <span className="font-bold">strictly prohibited</span></li>
                <li>This system contains privileged and confidential information protected under Federal and State regulations</li>
                <li>All system activities are monitored and logged in accordance with CJIS Security Policy</li>
                <li>Unauthorized access attempts may result in criminal prosecution</li>
              </ul>
            </div>

            <p className="text-sm">
              To request reinstatement of access, or if you believe this suspension was issued in error, please contact the system administrator and provide your incident reference number for further assistance.
            </p>
            
            <div className="font-mono text-center bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            INC-2024-LRX19ZDGC
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-700 hover:bg-gray-700 flex-1"
              onClick={() => setShowGuidelines(true)}
            >
              Security Guidelines
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-xs text-center text-gray-400 w-full">
            This is an official notice from the New York City Emergency Management Incidents Portal.
            All actions taken are in accordance with NYCEM Security Directive 2024-03.
          </p>
          <p className="text-xs text-center text-gray-500">
            System ID: NYCEM-IMS-{new Date().getFullYear()}-PROD
          </p>
        </CardFooter>
      </Card>

      <SecurityGuidelinesModal 
        open={showGuidelines} 
        onOpenChange={setShowGuidelines}
      />
    </div>
  );
};

export default AccountDisabledPage;