import type { DownloadItem } from "@/types";
import type { Overlay } from "@/lib/i18n/localize";

// Hindi overlay for the catalogue picker's `downloads` (lib/data/blog.ts),
// keyed by id. Only the visible title is translated; range names stay in
// English as on the rest of /hi (client, 2026-10-22). The PDFs themselves are
// the English catalogues.
export const downloadsHi: Overlay<DownloadItem> = {
  dl1: { title: "uPVC गोल्ड कैटलॉग" },
  dl2: { title: "SWR गोल्ड कैटलॉग" },
  dl3: { title: "UGD गोल्ड कैटलॉग" },
  dl4: { title: "Agri गोल्ड कैटलॉग" },
  dl5: { title: "TANKS कैटलॉग" },
};
