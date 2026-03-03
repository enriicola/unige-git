import { useState } from 'react';
import { BadgeCategory, BadgeLevel, BadgeMetric } from '#js/constants';
import BadgeModal from './BadgeModal';

function BadgeModalDemo() {
  const [activeBadge, setActiveBadge] = useState(null);

  const bronzeBadge = {
    key: 'challenge_3',
    name: 'First Steps',
    description: 'Complete 3 challenges',
    category: BadgeCategory.CHALLENGE_MILESTONE,
    level: BadgeLevel.BRONZE,
    iconKey: 'medal_bronze',
    threshold: 3,
    metric: BadgeMetric.CHALLENGES_COMPLETED,
    accuracyRequired: null,
  };

  const silverBadge = {
    key: 'challenge_5',
    name: 'On a Roll',
    description: 'Complete 5 challenges',
    category: BadgeCategory.CHALLENGE_MILESTONE,
    level: BadgeLevel.SILVER,
    iconKey: 'medal_silver',
    threshold: 5,
    metric: BadgeMetric.CHALLENGES_COMPLETED,
    accuracyRequired: null,
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100'>
      <button
        type='button'
        onClick={() => setActiveBadge(bronzeBadge)}
        className='bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition'
      >
        Show Bronze Badge
      </button>

      <button
        type='button'
        onClick={() => setActiveBadge(silverBadge)}
        className='bg-gray-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition'
      >
        Show Silver Badge
      </button>

      <BadgeModal badge={activeBadge} onClose={() => setActiveBadge(null)} />
    </div>
  );
}

export default BadgeModalDemo;
