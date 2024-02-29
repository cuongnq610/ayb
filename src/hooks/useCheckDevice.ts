import { useMediaQuery } from 'react-responsive';

export const UseCheckDevice = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 1024px)',
  });

  return { isMobile };
};
