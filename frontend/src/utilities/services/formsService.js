export const formsService = async(val='ACTIVE',formattedResponse = 'All')=>{
    try {
      console.log(val)
        const res = await fetch(`/api/v1/admin/forms?q=${val}&resp=${formattedResponse}`);
        const data = await res.json();
        if (!res.ok) {
          console.error('Error in fetching forms')
        }
        return data?.data;
      } catch (err){
        console.error('Error fetching Forms',err.message)
      }
}