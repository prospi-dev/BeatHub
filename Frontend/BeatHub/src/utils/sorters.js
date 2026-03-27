export const sortResults = (results, sortBy, type) => {
    const sorted = [...results]
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name))
        case 'date-newest':
            if (type === 'albums') {
                return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
            }
            return sorted
        case 'date-oldest':
            if (type === 'albums') {
                return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
            }
            return sorted
        case 'date':
            if (type === 'albums') {
                return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
            }
            return sorted
        case 'popularity':
            return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        case 'followers':
            return sorted.sort((a, b) => (b.followers?.total || 0) - (a.followers?.total || 0))
        default:
            return sorted
    }
}