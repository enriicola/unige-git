import APPLink from '#components/common/AppLink';
import styles from './StatusPage.module.css';

export default function StatusPage({
  title,
  description,
  ctaLabel = 'Go back to dashboard',
  ctaHref = '/',
}) {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <p>{description}</p>
      <APPLink href={ctaHref}>{ctaLabel}</APPLink>
    </div>
  );
}
