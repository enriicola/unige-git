import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function SkillTitleModal({ title, onClose }) {
  useEffect(() => {
    if (!title) {
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [title]);

  if (!title) return null;

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/60' />

      <div
        className='
        relative
        bg-white dark:bg-slate-900
        text-gray-900 dark:text-gray-100
        rounded-2xl
        p-8
        w-[420px]
        text-center
        shadow-xl
        z-10
      '
      >
        <h2 className='text-2xl font-bold mb-6'>🎉 TITLE UNLOCKED!</h2>

        <div className='mx-auto w-48 h-32 rounded-xl bg-purple-500 text-white flex items-center justify-center text-2xl font-semibold shadow-lg mb-4'>
          {title.name}
        </div>

        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          {title.description}
        </p>
        <div className='bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-5 text-left'>
          <h4 className='font-semibold mb-2 text-gray-800 dark:text-gray-100'>
            Requirements Achieved:
          </h4>
          <ul className='space-y-1 text-sm text-green-600 dark:text-green-400'>
            <li>✔ {title.minChallenges}+ challenges completed</li>
            <li>✔ {title.minAvgScore}%+ average score</li>
            <li>✔ {title.minBadges}+ badges earned</li>
          </ul>
        </div>
        <p className='text-xs text-blue-600 mb-6'>
          🎯 Titles are permanent and never decrease.
        </p>

        <button
          type='button'
          onClick={onClose}
          className='bg-blue-500 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-600'
        >
          Continue
        </button>
      </div>
    </div>,
    document.body
  );
}

export default SkillTitleModal;
