import { setMessageHandled } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type Message = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; handled: boolean; created_at: string };

export default async function AdminMessagesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("contact_messages").select("*").order("handled").order("created_at", { ascending: false }).limit(200);
  const messages = (data ?? []) as Message[];

  return (
    <>
      <h1 className="display text-4xl">Messages</h1>
      {error && <p className="mt-6 text-strawberry">Couldn&apos;t load messages: {error.message}</p>}
      <div className="mt-8 space-y-4">
        {messages.map((m) => (
          <article key={m.id} className={`rounded-3xl bg-paper p-6 ${m.handled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{m.subject}</p>
                <p className="text-sm text-espresso-soft">
                  {m.name} · <a href={`mailto:${m.email}`} className="underline underline-offset-4">{m.email}</a>
                  {m.phone && <> · <a href={`tel:${m.phone}`} className="underline underline-offset-4">{m.phone}</a></>}
                  {" · "}
                  {new Date(m.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Beirut" })}
                </p>
              </div>
              <form action={setMessageHandled}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="handled" value={String(!m.handled)} />
                <button className="btn btn-outline !min-h-9 !px-4 !text-[10px]">{m.handled ? "Mark as new" : "Mark handled"}</button>
              </form>
            </div>
            <p className="mt-4 whitespace-pre-line">{m.message}</p>
          </article>
        ))}
        {messages.length === 0 && !error && <p className="text-espresso-soft">No messages yet.</p>}
      </div>
    </>
  );
}
