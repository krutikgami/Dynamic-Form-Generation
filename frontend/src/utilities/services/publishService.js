export const handlePublish = async (publishData,onClose) => {
    try {
      const res = await fetch("/api/v1/admin/form", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(publishData)
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        alert(data.message);
        return;
      }
      alert("Form published successfully!");
      onClose()
      return data;
    } catch (error) {
      console.error("Publish error", error);
    }
}