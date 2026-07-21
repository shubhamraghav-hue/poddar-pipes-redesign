"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("tools");
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
        <h2 className="font-display text-lg font-medium text-slate-900">{t("heading")}</h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor={classId}>{t("inputPressureClass")}</Label>
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
          <Label htmlFor={sizeId}>{t("inputPipeSize")}</Label>
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
          <Label htmlFor={tempId}>{t("inputTemp")}</Label>
          <Select value={String(tempC)} onValueChange={(v) => setTempC(Number(v))}>
            <SelectTrigger id={tempId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMP_OPTIONS.map((temp) => (
                <SelectItem key={temp} value={String(temp)}>
                  {temp}°C
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
            {t("inputHumid")}
          </Label>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-paper-2 p-8">
        <h2 className="font-display text-lg font-medium text-slate-900">{t("resultsHeading")}</h2>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-sm text-slate-600">{t("wallThickness")}</span>
          <span className="font-mono text-sm font-medium text-slate-900">
            {wallThickness ? `${wallThickness.minMm}mm – ${wallThickness.maxMm}mm` : t("consultManual")}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-sm text-slate-600">{t("deratingFactor", { temp: tempC } as never)}</span>
          <Badge variant="brand-pill">×{derating.factor.toFixed(2)}</Badge>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-sm text-slate-600">{t("setTime")}</span>
          <span className="font-mono text-sm font-medium text-slate-900">
            {setMinutes != null
              ? `${formatMinutes(Math.round(setMinutes * humidMultiplier))}${humid ? ` (${t("humidSuffix")})` : ""}`
              : t("consultManual")}
          </span>
        </div>

        <div className="flex items-center justify-between pb-1">
          <span className="text-sm text-slate-600">{t("cureTime")}</span>
          <span className="font-mono text-sm font-medium text-slate-900">
            {cureMinutes != null
              ? `${formatMinutes(Math.round(cureMinutes * humidMultiplier))}${humid ? ` (${t("humidSuffix")})` : ""}`
              : t("consultManual")}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {t("disclaimer", { bucket: SIZE_BUCKET_LABELS[bucket], tempRange: TEMP_RANGE_LABELS[tempRange] } as never)}
        </p>
      </div>
    </div>
  );
}
