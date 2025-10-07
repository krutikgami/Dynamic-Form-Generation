export const formsService = async(val = 'ACTIVE', formattedResponse = 'All', selectedId = null, page , limit) => {
    try {
        let queryParams = `q=${val}&resp=${formattedResponse}&page=${page}&limit=${limit}`;
        if (selectedId) {
            queryParams += `&userId=${selectedId}`;
        }
        const res = await fetch(`/api/v1/admin/forms?${queryParams}`);
        const data = await res.json();
        if (!res.ok) {
            console.error('Error in fetching forms');
        }
        return {data: data?.data , meta: data?.meta};
    } catch (err) {
        console.error('Error fetching Forms', err.message);
    }
}