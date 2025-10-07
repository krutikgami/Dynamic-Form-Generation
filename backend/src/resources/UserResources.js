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
        maxSubmissions : formData.maxSubmissions,
        endDate : formData.endDate,
        status : formData.status,
        created_at : formData.created_at
    }
}

export const adminFormRenderer = (formData)=>{
    if(!formData) return null;
    const key = formData.isPublic ? "excludedUsers" : "accessControls";
    const value = formData[key];
    return{
        id : formData.id,
        title : formData.title,
        isPublic : formData.isPublic,
        isEditable : formData.isEditable,
        description : formData.description,
        startDate : formData.startDate,
        endDate : formData.endDate,
        status : formData.status,
        maxSubmissions : formData.maxSubmissions,
        [key] : value ?? []
    }
}

export const getUserFormSubmission = (submission,formExists)=>{
    if(!submission) return null;
    return{
        email : submission.user.email,
        name : submission.user.name,
        isEditable: formExists.isEditable,
        deleted_at : submission.deleted_at,
        created_at : submission.created_at
    }
}

export const getAdminFormSubmission = (submission)=>{
    if(!submission) return null;
    return{
        email : submission.user.email,
        name : submission.user.name,
        created_at : submission.created_at, 
        deleted_at : submission.deleted_at
    }
}

export const getMetaData = (totalRecords, totalPages,currentPage)=>{
    return {
        totalRecords,
        totalPages,
        currentPage : parseInt(currentPage)
    }
}