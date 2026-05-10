import { useEffect, useState } from 'react';
import axios from 'axios';
export function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!url) return;
        setLoading(true);
        setError(null);
        axios.get(url)
            .then(r => setData(r.data))
            .catch(() => setError('No se pudo cargar el contenido.'))
            .finally(() => setLoading(false));
    }, [url]);
    return { data, loading, error };
}
