export const formsService = async(val = 'ACTIVE', formattedResponse = 'All', selectedId = null) => {
    try {
        let queryParams = `q=${val}&resp=${formattedResponse}`;
        if (selectedId) {
            queryParams += `&userId=${selectedId}`;
        }
        const res = await fetch(`/api/v1/admin/forms?${queryParams}`);
        const data = await res.json();
        if (!res.ok) {
            console.error('Error in fetching forms');
        }
        return data?.data;
    } catch (err) {
        console.error('Error fetching Forms', err.message);
    }
}