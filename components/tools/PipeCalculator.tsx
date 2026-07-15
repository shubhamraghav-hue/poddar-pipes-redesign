"use client";

import { useId, useMemo, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  type PressureClass,
  PRESSURE_CLASS_LABELS,
  availableSizes,
  getWallThickness,
  nearestDeratingFactor,
  sizeToBucket,
  tempCToRange,
  initialSetMinutes,
  jointCureMinutes,
  formatMinutes,
  SIZE_BUCKET_LABELS,
  TEMP_RANGE_LABELS,
} from "@/lib/data/agriTechnicalData";

const TEMP_OPTIONS = [23, 27, 32, 38, 43, 49, 54, 60];

export function PipeCalculator() {
  const [pressureClass, setPressureClass] = useState<PressureClass>("class3");
  const sizes = useMemo(() => availableSizes(pressureClass), [pressureClass]);
  const [size, setSize] = useState<number>(sizes[0]);
  const [tempC, setTempC] = useState<number>(23);
  const [humid, setHumid] = useState(false);

  const sizeId = useId();
  const classId = useId();
  const tempId = useId();
  const humidId = useId();

  function handleClassChange(next: PressureClass) {
    setPressureClass(next);
    const nextSizes = availableSizes(next);
    if (!nextSizes.includes(size)) setSize(nextSizes[0]);
  }

  const wallThickness = getWallThickness(pressureClass, size);
  const derating = nearestDeratingFactor(tempC);
  const bucket = sizeToBucket(size);
  const tempRange = tempCToRange(tempC);
  const setMinutes = initialSetMinutes(bucket, tempRange);
  const cureMinutes = jointCureMinutes(bucket, tempRange);
  const humidMultiplier = humid ? 1.5 : 1;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white p-8">
        <h2 className="font-display text-lg font-medium text-slate-900">Pipe & site conditions</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor={classId}>Pressure class</Label>
          <Select value={pressureClass} onValueChange={(v) => handleClassChange(v as PressureClass)}>
            <SelectTrigger id={classId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PRESSURE_CLASS_LABELS) as PressureClass[]).map((c) => (
                <SelectItem key={c} value={c}>
                  {PRESSURE_CLASS_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={sizeId}>Nominal pipe size</Label>
          <Select value={String(size)} onValueChange={(v) => setSize(Number(v))}>
            <SelectTrigger id={sizeId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}mm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={tempId}>Ambient temperature</Label>
          <Select value={String(tempC)} onValueChange={(v) => setTempC(Number(v))}>
            <SelectTrigger id={tempId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMP_OPTIONS.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  {t}°C
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <input
            id={humidId}
            type="checkbox"
            checked={humid}
            onChange={(e) => setHumid(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-ocean-600 focus-visible:outline-2 focus-visible:outline-ocean-500"
          />
          <Label htmlFor={humidId} className="cursor-pointer">
            Damp or humid site conditions
          </Label>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-paper-2 p-8">
        <h2 className="font-display text-lg font-medium text-slate-900">Recommended figures</h2>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-sm text-slate-600">Wall thickness (IS 4985)</span>
          <span className="font-mono text-sm font-medium text-slate-900">
            {wallThickness ? `${wallThickness.minMm}mm – ${wallThickness.maxMm}mm` : "Not available for this size/class"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-sm text-slate-600">Pressure de-rating factor at {tempC}°C</span>
          <Badge variant="brand-pill">×{derating.factor.toFixed(2)}</Badge>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-sm text-slate-600">Solvent cement initial set time</span>
          <span className="font-mono text-sm font-medium text-slate-900">
            {setMinutes != null
              ? `${formatMinutes(Math.round(setMinutes * humidMultiplier))}${humid ? " (+50% humid)" : ""}`
              : "Consult manual"}
          </span>
        </div>

        <div className="flex items-center justify-between pb-1">
          <span className="text-sm text-slate-600">Joint cure time before pressurising</span>
          <span className="font-mono text-sm font-medium text-slate-900">
            {cureMinutes != null
              ? `${formatMinutes(Math.round(cureMinutes * humidMultiplier))}${humid ? " (+50% humid)" : ""}`
              : "Consult manual"}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Size bucket: {SIZE_BUCKET_LABELS[bucket]} · Temperature range: {TEMP_RANGE_LABELS[tempRange]}. Cure
          time assumes a working pressure up to 160 psi (11 bar), covering Agri Gold&apos;s Class 2 and Class 3
          ratings. These figures are laboratory estimates from the Poddar Agri Gold catalogue — field
          conditions vary, so use as a planning reference, not a substitute for on-site judgement.
        </p>
      </div>
    </div>
  );
}
