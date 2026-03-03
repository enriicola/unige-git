'use client';

import { use } from 'react';
import MatchSettingForm from '#modules/match-settings/form';
import StatusPage from '#components/common/StatusPage';

export default function MatchSettingDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams || {};
  const matchSettingId = Number(id);

  if (!Number.isFinite(matchSettingId)) {
    return (
      <StatusPage
        title='Match setting not found'
        description='This match setting does not exist.'
        ctaLabel='Back to match settings'
        ctaHref='/match-settings'
      />
    );
  }

  return <MatchSettingForm matchSettingId={matchSettingId} />;
}
