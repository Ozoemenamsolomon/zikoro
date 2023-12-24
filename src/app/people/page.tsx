"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to "/people/all" after the component mounts
    router.push('/people/all');
  }, []); // The empty dependency array ensures that this effect runs only once

  // You can render something here if needed
  return <div>Redirecting...</div>;
}
