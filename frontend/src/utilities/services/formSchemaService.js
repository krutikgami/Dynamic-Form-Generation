export const formSchemaService = async (formId) => {
    try {
      const res = await fetch("/api/v1/admin/form/schema", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({formId})
      });

      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Get Schema Error", error);
    }
}