"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CertDownloadButton({ code, name }: { code: string; name: string }) {
  function handleDownload() {
    const content = `PODDAR PIPES
Certification Reference (Sample)

Certification: ${code}
Scope: ${name}

This is a sample placeholder document generated for demonstration purposes.
Contact our sales team for verified, signed certification copies.
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${code.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-reference.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleDownload}
      aria-label={`Download ${code} certificate`}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
