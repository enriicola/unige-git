'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, LightbulbOff } from 'lucide-react';
import logo from '#img/logo.jpg';
import { Button } from '#components/common/Button';
import { useAppDispatch, useAppSelector } from '#js/store/hooks';
import { fetchUserInfo, logoutUser } from '#js/store/slices/auth';
import { setTheme } from '#js/store/slices/ui';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, isLoggedIn, loading } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.ui.theme);
  const isDark = theme === 'dark';
  const fetchedUserRef = useRef(false);
  const audioOnRef = useRef(null);
  const audioOffRef = useRef(null);

  useEffect(() => {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!theme) {
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch, theme]);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioOnRef.current = new Audio('/lamp-on.mp3');
      audioOffRef.current = new Audio('/lamp-off.mp3');
      audioOnRef.current.preload = 'auto';
      audioOffRef.current.preload = 'auto';
    }

    return () => {
      audioOnRef.current = null;
      audioOffRef.current = null;
    };
  }, []);

  const playThemeToggleSound = (nextTheme) => {
    const audio =
      nextTheme === 'light' ? audioOnRef.current : audioOffRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    playThemeToggleSound(nextTheme);
    dispatch(setTheme(nextTheme));
  };

  useEffect(() => {
    if (fetchedUserRef.current || loading || isLoggedIn || user) return;
    fetchedUserRef.current = true;
    dispatch(fetchUserInfo());
  }, [dispatch, isLoggedIn, loading, user]);

  const navLinks = useMemo(() => {
    if (isLoggedIn && user?.role === 'student') {
      return [
        { href: '/student/', label: 'Profile' },
        { href: '/student/challenges', label: 'Challenges' },
        { href: '/student/rewards', label: 'Game Rules Guide' },
        { href: '/student/leaderboard', label: 'Leaderboard' },
      ];
    }
    if (isLoggedIn) {
      return [
        { href: '/', label: 'Dashboard' },
        { href: '/challenges', label: 'Challenges' },
        { href: '/match-settings', label: 'Match Settings' },
        { href: '/new-challenge', label: 'New Challenge' },
      ];
    }
    return [];
  }, [isLoggedIn, user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch (err) {
      setIsLoggingOut(false);
      return;
    }
    setIsLoggingOut(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <Link href='/' className={styles.logo}>
        <span className={styles['logo-mark']}>
          {' '}
          <Image
            src={logo}
            alt='CodyMatch Logo'
            fill
            sizes='32px'
            className={styles['logo-image']}
          />
        </span>
        <span className={styles['logo-text']}>CodyMatch</span>
      </Link>
      <div className={styles.actions}>
        {navLinks.length > 0 && (
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles['nav-link']}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <Button
          type='button'
          variant='secondary'
          size='icon'
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? <LightbulbOff aria-hidden /> : <Lightbulb aria-hidden />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
        {isLoggedIn && user ? (
          <div className={styles.user}>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user.username}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <Button
              variant='secondary'
              size='sm'
              onClick={handleLogout}
              disabled={isLoggingOut}
              title='Sign out of your account'
            >
              {isLoggingOut ? 'Logout…' : 'Logout'}
            </Button>
          </div>
        ) : (
          <Button size='sm' onClick={handleLogin} title='Go to the login page'>
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
