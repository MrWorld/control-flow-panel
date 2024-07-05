import { useEffect, useState } from 'react';

const useCountUp = (targetDate) => {
    const countUpDate = new Date() - new Date(targetDate);

    const [CountUp, setCountUp] = useState(
        countUpDate
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountUp(countUpDate);
        }, 1000);

        return () => clearInterval(interval);
    }, [countUpDate]);

    return getReturnValues(CountUp);
};

const getReturnValues = (CountUp) => {
    // calculate time left
    const days = Math.floor(CountUp / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (CountUp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((CountUp % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((CountUp % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
};

export { useCountUp };