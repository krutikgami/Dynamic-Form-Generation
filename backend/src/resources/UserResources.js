export const getForms = (formsData) =>{
    if(!formsData) return null;
    return {
        id : formsData.id,
        title : formsData.title,
        description : formsData.description,
        schema : formsData.schema,
        accessControls : formsData.accessControls
    }
}