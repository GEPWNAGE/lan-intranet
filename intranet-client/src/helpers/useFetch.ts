import { useEffect, useState } from 'react';

function handleJSON(res: Response) {
    return res.json();
}

export default function useFetch<V>(
    url: string,
    initialValue: V,
    handleResponse: (res: Response) => Promise<V> = handleJSON,
) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        fetch(url)
            .then(handleResponse)
            .then(setValue);
    }, [url]);

    return value;
}
