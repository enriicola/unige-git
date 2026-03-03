import Spinner from '#components/common/Spinner';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner label='Loading page…' />
    </div>
  );
}
