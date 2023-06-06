import 'css/tailwind.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

//core
import 'primereact/resources/primereact.min.css';
import 'css/theme.css';

import { AppProps } from 'next/app';
import { AuthProvider } from 'hooks/useAuth';
import { TeamProvider } from 'hooks/useTeam';
import { ToastProvider } from 'hooks/useToast';

export default function App({ Component, pageProps }: AppProps) {
  const PageComponent = Component as any;
  return (
    <AuthProvider>
      <TeamProvider>
        <ToastProvider>
          <PageComponent {...pageProps} />
        </ToastProvider>
      </TeamProvider>
    </AuthProvider>
  );
}
