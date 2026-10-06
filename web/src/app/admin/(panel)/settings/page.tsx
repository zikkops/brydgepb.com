import { SettingsForm } from "./SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <>
      <h1 className="display text-4xl">Delivery</h1>
      <p className="mt-2 text-sm text-espresso-soft">Used at checkout. Orders already placed keep the fee they were placed with.</p>
      <div className="mt-8 max-w-md rounded-3xl bg-paper p-6">
        <SettingsForm deliveryFee={settings.deliveryFee} freeDeliveryOver={settings.freeDeliveryOver} />
      </div>
    </>
  );
}
