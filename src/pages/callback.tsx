import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query; // obtain access token from URL query parameters
    if (code) {
      window.opener.postMessage(
        { type: 'authentication', code: code },
        window.location.origin
      );
      window.close();
    } else {
      console.error('Access token not found in URL query parameters');
    }
  }, [router.query]);

  return <div>Processing authentication...</div>;
};

export default CallbackPage;
