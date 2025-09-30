import { useToast } from "../../components/ToastContainerUtility/ToastContainer.jsx";

export function usePublish() {
  const { showToast } = useToast();

  const publish = async (publishData, onClose) => {
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
        if (data?.errors) {
          data.errors.forEach((err) => showToast(err.message, data.success));
        } else {
          showToast(data.message, data.success);
        }
        return;
      }

      showToast(data.message, data.success);
      if (onClose) onClose();
      return data;
    } catch (error) {
      console.error("Publish error", error);
    }
  };

  return { publish };
}
