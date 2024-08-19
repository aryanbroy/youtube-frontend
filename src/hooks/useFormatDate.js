import { formatDistanceToNow } from "date-fns"

const useFormatDate = (date) => {
    const formattedDate = formatDistanceToNow(date, { addSuffix: true });
    return formattedDate;
}

export default useFormatDate;