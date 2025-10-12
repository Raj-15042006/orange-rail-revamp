import { useEffect, useState } from 'react';
import { initCSVData, TrnRow, StnRow } from '@/services/csvData';

export function useTrainCSVData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trains, setTrains] = useState<TrnRow[]>([]);
  const [stations, setStations] = useState<StnRow[]>([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const { trnData, stnData } = await initCSVData();
        
        setTrains(trnData);
        setStations(stnData);
        setDataReady(true);
      } catch (err) {
        console.error('Failed to load CSV data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load CSV data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return { isLoading, error, trains, stations, dataReady };
}
