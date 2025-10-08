export const formSchemaService = async (formId,validate) => {
    try {
      const res = await fetch("/api/v1/admin/form/schema", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({formId,validate})
      });

      const data = await res.json();
      return {data: data.data,res: data};
    } catch (error) {
      console.error("Get Schema Error", error);
    }
}