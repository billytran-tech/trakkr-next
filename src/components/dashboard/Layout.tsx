import { ReactNode } from 'react';
import { NextPage } from 'next';

import Navbar from 'components/dashboard/Navbar';

interface Props {
  children: ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
