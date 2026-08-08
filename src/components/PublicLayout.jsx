import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Customizer from './Customizer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Customizer />
    </div>
  );
}
