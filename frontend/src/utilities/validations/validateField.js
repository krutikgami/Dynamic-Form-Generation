 export const validateField = (field, value) => {
    let error = "";

    if (field.validations) {
      for (let [rule, ruleObj] of Object.entries(field.validations)) {
        if (!ruleObj.value) continue; 
        switch (rule) {
          case "required":
            if (!value || (Array.isArray(value) && value.length === 0)) {
              error = ruleObj.message;
            }
            break;

          case "min":
            if (value && value.length < parseInt(ruleObj.ruleValue)) {
              error = ruleObj.message;
            }
            break;
            
          case "max":
            if(value && value.length > parseInt(ruleObj.ruleValue)){
                error = ruleObj.message;
            }
            break;
        
          case "pattern": {
            const regex = new RegExp(
              ruleObj.ruleValue.replace(/^\/|\/$/g, "")
            );
            if (value && !regex.test(value)) {
              error = ruleObj.message;
            }
            break;
          }

          default:
            break;
        }

        if (error) break; 
      }
    }

    return error;
};