import { useEffect } from 'react';

const RefreshPage = () => {
  useEffect(() => {
    window.location.reload();
  }, []);

  return null;
};

export default RefreshPage;
