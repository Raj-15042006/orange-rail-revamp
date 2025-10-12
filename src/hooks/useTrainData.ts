import { useEffect, useState } from 'react';
import { initDatabases, getHistDb, getPndDb, getTableNames, getTableSchema } from '@/services/database';

export function useTrainData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [histTables, setHistTables] = useState<string[]>([]);
  const [pndTables, setPndTables] = useState<string[]>([]);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function loadDatabases() {
      try {
        setIsLoading(true);
        await initDatabases();
        
        const histDb = getHistDb();
        const pndDb = getPndDb();

        if (histDb && pndDb) {
          const histTableNames = getTableNames(histDb);
          const pndTableNames = getTableNames(pndDb);
          
          setHistTables(histTableNames);
          setPndTables(pndTableNames);
          
          console.log('Historical DB Tables:', histTableNames);
          console.log('Pending DB Tables:', pndTableNames);
          
          // Log schema for first table if exists
          if (histTableNames.length > 0) {
            console.log(`Schema for ${histTableNames[0]}:`, getTableSchema(histDb, histTableNames[0]));
          }
          if (pndTableNames.length > 0) {
            console.log(`Schema for ${pndTableNames[0]}:`, getTableSchema(pndDb, pndTableNames[0]));
          }
          
          setDbReady(true);
        }
      } catch (err) {
        console.error('Failed to load databases:', err);
        setError(err instanceof Error ? err.message : 'Failed to load databases');
      } finally {
        setIsLoading(false);
      }
    }

    loadDatabases();
  }, []);

  return { isLoading, error, histTables, pndTables, dbReady };
}
