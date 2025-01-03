import useSWR from 'swr';

export function useProfile() {
  const foo = useSWR('profile', () => {
    return fetch('/api/profile').then((res) => res.json());
  });
}
