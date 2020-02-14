import { useEffect, useState } from 'react';

function handleJSON(res: Response) {
    return res.json();
}

export default function useFetch<V>(
    url: string | { version: number, url: string },
    initialValue: V,
    handleResponse: (res: Response) => Promise<V> = handleJSON,
) {
    const actualUrl = typeof url === 'string' ? url : url.url;
    const version = typeof url === 'string' ? null : url.version;

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        fetch(actualUrl)
            .then(handleResponse)
            .then(setValue);
    }, [actualUrl, version, handleResponse]);

    return value;
}
