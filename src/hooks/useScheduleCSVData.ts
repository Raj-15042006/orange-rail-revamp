import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useScheduleCSVData = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    fetch('/data/Sch.csv')
      .then(res => res.text())
      .then(csvText => {
        const { data } = Papa.parse(csvText, { header: true });
        setSchedules(data);
        setDataReady(true);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { schedules, isLoading, error, dataReady };
};
