'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '#components/common/Button';
import { Input } from '#components/common/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';
import { useAppDispatch, useAppSelector } from '#js/store/hooks';
import { fetchUserInfo, loginUser } from '#js/store/slices/auth';
import styles from './page.module.css';

const demoAccounts = [
  {
    label: 'Teacher',
    email: 'teacher1@codymatch.test',
    password: 'password123',
  },
  {
    label: 'Student',
    email: 'student1@codymatch.test',
    password: 'password123',
  },
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isLoggedIn, loading, error } = useAppSelector(
    (state) => state.auth
  );
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState(null);
  const fetchedUserRef = useRef(false);

  useEffect(() => {
    if (fetchedUserRef.current || isLoggedIn || user) return;
    fetchedUserRef.current = true;
    dispatch(fetchUserInfo());
  }, [dispatch, user, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const target =
      user.role === 'student' ? '/student/challenges' : '/challenges';
    router.replace(target);
  }, [isLoggedIn, user, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    const email = form.email.trim();
    const { password } = form;

    if (!email || !password) {
      setFormError('Please enter email and password');
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      const loggedUser = result?.user;
      const target =
        loggedUser?.role === 'student' ? '/student/challenges' : '/challenges';
      router.replace(target);
    } catch (err) {
      setFormError(err || 'Login failed');
    }
  };

  const activeError = formError || error;

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Sign in</p>
        <h1>Sign in to CodyMatch</h1>
        <p className={styles.subtitle}>
          Use the demo credentials to try the student and teacher roles in two
          different sessions.
        </p>
      </div>

      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Demo accounts</CardTitle>
          <CardDescription>
            Teachers can access all sections except the student area. Students
            can only access their own area with assigned challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className={styles.demoList}>
            {demoAccounts.map((item) => (
              <li key={item.email} className={styles.demoItem}>
                <span className={styles.demoLabel}>{item.label}</span>
                <span className={styles.demoEmail}>{item.email}</span>
                <span className={styles.demoPassword}>
                  Password: {item.password}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Passwords are stored hashed on the backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor='login-email'>Email</label>
              <Input
                id='login-email'
                name='email'
                type='email'
                placeholder='you@example.com'
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor='login-password'>Password</label>
              <Input
                id='login-password'
                name='password'
                type='password'
                placeholder='••••••••'
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {activeError && (
              <div className={styles.error} role='alert'>
                {activeError}
              </div>
            )}

            <Button
              type='submit'
              disabled={loading}
              className={styles.submit}
              title='Sign in to your account'
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
