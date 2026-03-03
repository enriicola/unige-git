import StatusPage from '#components/common/StatusPage';

export default function ForbiddenPage() {
  return (
    <StatusPage
      title='403 – Access denied'
      description='You do not have access to this content.'
      ctaLabel='Go back to dashboard'
      ctaHref='/'
    />
  );
}
