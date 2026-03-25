import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetchState } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * useFetch Hook
 * Standardized data fetching with persistent AsyncStorage caching.
 */
function useFetch<T>(endpoint: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fullUrl = `${BASE_URL}${endpoint}`;
    const cacheKey = `cache_${endpoint}`;

    const fetchData = async () => {
      let hasCachedData = false;

      // Step 3: Check AsyncStorage for cached data first
      try {
        const cachedValue = await AsyncStorage.getItem(cacheKey);
        if (cachedValue && isMounted) {
          setData(JSON.parse(cachedValue));
          hasCachedData = true;
          // Show cache immediately and stop initial loading spinner
          setIsLoading(false);
        }
      } catch (e) {
        // Silently fail cache retrieval
        console.warn('Cache retrieval failed:', e);
      }

      // Step 4: Always fetch fresh data from the API
      try {
        const response = await fetch(fullUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const freshData = await response.json();

        if (isMounted) {
          setData(freshData);
          setError(null);
          setIsLoading(false);

          // Step 5: Save fresh data to AsyncStorage
          await AsyncStorage.setItem(cacheKey, JSON.stringify(freshData));
        }
      } catch (err: any) {
        if (isMounted) {
          // Step 6 & 7: Check if we have cached data before setting error
          if (!hasCachedData) {
            // No cache available, show error to user
            setError(err.message || 'Failed to load. Check your connection.');
          }
          // If cache exists, we stay silent as per requirement #6
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, isLoading, error };
}

export default useFetch;
