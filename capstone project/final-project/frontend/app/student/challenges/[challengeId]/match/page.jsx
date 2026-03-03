'use client';

import { useParams } from 'next/navigation';
import { useAppSelector } from '#js/store/hooks';
import { Card, CardContent } from '#components/common/card';
import MatchContainer from '../(components)/MatchContainer';

export default function MatchPage() {
  const params = useParams();
  const challengeId = params?.challengeId;
  const { user, loading } = useAppSelector((state) => state.auth);
  const studentId = user?.id;

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto py-10'>
        <Card>
          <CardContent className='py-10 text-center text-sm text-muted-foreground'>
            Loading your profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!studentId) return null;

  return <MatchContainer challengeId={challengeId} studentId={studentId} />;
}
