import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instrument_Sans } from 'next/font/google';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export default function LandingPage() {
  return (
    <div className={instrumentSans.className}>
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-lg bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <Shield className="h-16 w-16 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">NYC Incident Dashboard</CardTitle>
          <p className="text-center text-sm text-gray-400">Emergency Management System</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-300">
            Welcome to the NYC Incident Dashboard, a secure platform for authorized emergency response personnel.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-gray-600 text-dark hover:bg-gray-700">
              <Link href="/register">Register for Access</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-400 w-full">
            This is an official website. Unauthorized access is prohibited and subject to prosecution.
          </p>
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        <p className="mt-1">For official use only.</p>
      </footer>
    </div>
    </div>
  );
}