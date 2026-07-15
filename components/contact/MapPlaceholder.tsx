import { offices } from "@/lib/data/offices";
import { hasPlaceholder } from "@/lib/seo";

// Only the HQ office currently has a real, verified address — regional
// offices are still bracketed placeholders (see CONTENT_TODOS.md). Showing
// fake pins for unknown locations on a real map would be worse than no map
// at all, so this embeds a real Google Maps location for the one address we
// can verify, and simply lists the rest as "location to be confirmed."
export function MapPlaceholder() {
  const verifiedOffices = offices.filter(
    (office) => !hasPlaceholder(office.city, office.address)
  );
  const unverifiedOffices = offices.filter((office) =>
    hasPlaceholder(office.city, office.address)
  );
  const hq = verifiedOffices[0];

  return (
    <section className="container-edge pb-24 md:pb-28">
      <div className="overflow-hidden rounded-3xl border border-slate-200/70">
        {hq ? (
          <iframe
            title={`Map location — ${hq.type}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(hq.address)}&output=embed`}
            className="aspect-[16/8] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="bg-grid flex aspect-[16/8] w-full items-center justify-center bg-paper-2 text-sm text-slate-500">
            Map unavailable — no verified office address yet.
          </div>
        )}
      </div>
      {unverifiedOffices.length > 0 && (
        <p className="mt-4 text-sm text-slate-500">
          {unverifiedOffices.map((o) => o.type).join(", ")}: location to be confirmed.
        </p>
      )}
    </section>
  );
}
