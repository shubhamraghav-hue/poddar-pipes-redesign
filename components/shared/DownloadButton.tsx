"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadButton({ title, fileUrl }: { title: string; fileUrl?: string }) {
  // Real catalogue PDF — link directly, no placeholder needed.
  if (fileUrl) {
    return (
      <Button size="icon" variant="outline" asChild aria-label={`Download ${title}`}>
        <a href={fileUrl} download>
          <Download className="h-4 w-4" />
        </a>
      </Button>
    );
  }

  // No real file for this entry yet — generate an explicitly-labelled sample
  // rather than pretend a placeholder is the real document.
  function handleDownload() {
    const content = `PODDAR PIPES
${title} (Sample)

This is a sample placeholder document generated for demonstration purposes.
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button size="icon" variant="outline" onClick={handleDownload} aria-label={`Download ${title}`}>
      <Download className="h-4 w-4" />
    </Button>
  );
}
