import * as React from 'react';

import { useInterval } from '../../../helpers/useInterval';

export default function useTime(delay = 1000): [Date] {
    const [time, setTime] = React.useState(new Date());

    useInterval(() => {
        setTime(new Date());
    }, delay);

    return [time];
}
