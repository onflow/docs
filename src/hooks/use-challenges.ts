import useSWR from 'swr';
import { Challenges } from '../types/gold-star';
import { getChallenges } from '../utils/gold-star';

export function useChallenges() {
  const {
    data: challenges,
    isLoading,
    error,
  } = useSWR<Challenges>('getChallenges', getChallenges);

  return {
    challenges,
    isLoading,
    error,
  };
}
