import { useState } from 'react';

const COOKIE_NOTICE_KEY = 'cookie_notice_acknowledged';

export function useCookieNotice() {
  const [acknowledged, setAcknowledged] = useState(
    () => !!localStorage.getItem(COOKIE_NOTICE_KEY)
  );

  const acknowledge = () => {
    localStorage.setItem(COOKIE_NOTICE_KEY, '1');
    setAcknowledged(true);
  };

  return { showNotice: !acknowledged, acknowledge };
}
