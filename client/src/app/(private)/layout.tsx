'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace('/signin');
    }
  }, [router]);


  return <>{children}</>;
}
