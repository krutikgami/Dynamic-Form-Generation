export const getForms = (formsData) =>{
    if(!formsData) return null;
    return {
        id : formsData.id,
        title : formsData.title,
        description : formsData.description
    }
}

export const adminFormManagerRes = (formData)=>{
    if(!formData) return null;
    return {
        id : formData.id,
        title : formData.title,
        description : formData.description,
        analytics : formData.analytics
    }
}


export const adminFormAnalytics = (formData)=>{
    if(!formData) return null

    return{
        id : formData.id,
        title : formData.title,
        description : formData.description,
        analytics : formData.analytics,
        startDate : formData.startDate,
        endDate : formData.endDate,
        status : formData.status,
        created_at : formData.created_at
    }
}

export const adminFormRenderer = (formData)=>{
    if(!formData) return null;
    return{
        id : formData.id,
        title : formData.title,
        description : formData.description,
        startDate : formData.startDate,
        endDate : formData.endDate,
        status : formData.status,
        maxSubmissions : formData.maxSubmissions,
        accessControls : formData.accessControls
    }
}