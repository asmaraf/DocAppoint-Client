import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';

export const metadata = {
  title: 'DocAppoint - Doctor Appointment Booking System',
  description: 'Book verified specialist doctors, manage appointment schedules, check real-time availability, and access quality patient healthcare.',
  keywords: ['Doctor Appointment', 'DocAppoint', 'Book Doctor Online', 'Cardiologist', 'Neurologist', 'Medical Consultation'],
  authors: [{ name: 'DocAppoint Team' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'DocAppoint - Doctor Appointment Manager',
    description: 'Book certified medical specialists in seconds with zero hassle.',
    url: 'https://docappoint.vercel.app',
    siteName: 'DocAppoint',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ChunkErrorHandler />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0f172a',
                  color: '#fff',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.875rem'
                },
                success: {
                  iconTheme: {
                    primary: '#14b8a6',
                    secondary: '#fff'
                  }
                }
              }}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
