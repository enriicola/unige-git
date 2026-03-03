// eslint-disable-next-line camelcase
import { Open_Sans, Roboto } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '#css/styles.css';
import ReduxProvider from '#js/store/redux-provider';
import Header from '#components/layout/Header';
import Footer from '#components/layout/Footer';
import styles from './layout.module.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
  variable: '--font-roboto',
});

export const metadata = {
  title: 'CodyMatch Frontend Demo',
  description:
    'Minimal Next.js app showing how to structure challenges, match settings and students.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`${roboto.variable} ${openSans.variable}`}>
      <body className={styles.wrapper}>
        <ReduxProvider>
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
          <Toaster
            position='top-center'
            containerStyle={{
              top: '40%',
              transform: 'translateY(-50%)',
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
