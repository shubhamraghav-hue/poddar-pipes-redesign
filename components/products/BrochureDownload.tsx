"use client";

import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

function downloadCompanyProfile() {
  const content = `PODDAR PIPES
Product Catalogue (Sample)

Poddar Pipes manufactures uPVC, CPVC, and SWR pipes, along with water
storage TANKS, underground drainage (UGD) systems, and Agriculture
piping systems for the Indian market.

This is a sample document generated for demonstration purposes.
`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "poddar-pipes-catalogue.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function BrochureDownload() {
  return (
    <section className="container-edge py-24 md:py-28">
      <RevealOnScroll>
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-slate-200/70 bg-white p-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ocean-600/10 text-ocean-700">
              <FileText className="h-6 w-6" strokeWidth={1.7} />
            </div>
            <div>
              <h3 className="font-display text-xl font-medium text-slate-900">
                Full product catalogue & specifications
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Download the complete Poddar Pipes product catalogue as a single reference document.
              </p>
            </div>
          </div>
          <Button
            onClick={downloadCompanyProfile}
            size="lg"
            className="relative w-full md:w-auto"
          >
            <Download className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 md:static md:translate-y-0" />
            Download Catalogue
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  );
}
