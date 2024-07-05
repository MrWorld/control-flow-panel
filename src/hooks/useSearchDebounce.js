import { useState } from 'react'

let searchDebounce = null;
export const useSearchDebounce = () => {
    const [query, setQuery] = useState('')

    const handleChangeSearch = ({ target }) => {
        const inputValue = target.value;
        clearTimeout(searchDebounce);

        searchDebounce = setTimeout(() => {
            setQuery(inputValue)
        }, 500);
    }

    return {
        query: query,
        handleChangeSearch: handleChangeSearch,
    }
}