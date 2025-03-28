import { useCallback } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const useFormatDay = () => {
    const formatDay = useCallback((selectedDays) => {
        if (!selectedDays || selectedDays.length === 0) return "";

        const startIdx = WEEKDAYS.indexOf(selectedDays[0]);
        const endIdx = WEEKDAYS.indexOf(selectedDays[selectedDays.length - 1]);

        if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return selectedDays.join(", ");

        return `${WEEKDAYS[startIdx]}-${WEEKDAYS[endIdx]}`;
    }, []);

    return { formatDay };
};

export default useFormatDay;
