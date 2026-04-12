import { useRouter } from "next/navigation";
import { useShipmentStore } from "@/store/shipment-store";
import { mapShipmentToStore } from "@/utils/shipment-helper";
import { Shipment, CustomsData } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle shipment duplication logic.
 */
export const useDuplicateShipment = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const { setSender, setRecipient, setPackages, reset, setStep } =
    useShipmentStore();

  const duplicateShipment = (shipment: Shipment) => {
    try {
      // 1. Reset current store to avoid stale data
      reset();

      // 2. Map snapshot to store state
      const mappedData = mapShipmentToStore(shipment);

      // 3. Populate store
      setSender(mappedData.sender as any); // Type assertion if needed validation matches stricter store type
      setRecipient(mappedData.recipient as any);
      setPackages(mappedData.packages);

      // 3.5. Set customs data if available
      const { setCustoms } = useShipmentStore.getState();
      if (mappedData.customs) {
        setCustoms(mappedData.customs as any);
      }

      // 4. Mark sections as completed to reveal them in the UI
      useShipmentStore.getState().markSectionCompleted("pickup");
      useShipmentStore.getState().markSectionCompleted("dropoff");
      useShipmentStore.getState().markSectionCompleted("package");

      // 4.5. Mark customs as completed if customs data exists
      if (mappedData.customs) {
        useShipmentStore.getState().markSectionCompleted("customs");
      }

      // 5. Expand the Service Selection section since all prior steps are done
      useShipmentStore.getState().setExpandedSection("service");

      // 6. Set Navigation to Step 1 (or appropriate step)
      setStep(1);

      // 5. Notify and Redirect
      addToast({
        title: "Shipment Duplicated",
        message: "Details have been copied to the new shipment form.",
        type: "success",
      });

      router.push("/app/shipments/new?source=duplicate");
    } catch (error) {
      console.error("Failed to duplicate shipment", error);
      addToast({
        title: "Error",
        message: "Could not duplicate shipment details.",
        type: "error",
      });
    }
  };

  return { duplicateShipment };
};
