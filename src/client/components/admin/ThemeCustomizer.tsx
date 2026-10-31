"use client";
import "@/client/components/card/card-styles.css";
import { memo, useCallback, useState } from "react";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { Palette, Check, Sparkles } from "lucide-react";
import {
  templates,
  palettes,
  decorOptions,
  colorPresets,
  getTemplate,
} from "@/shared/constants/card-themes";
import type { CardTheme, DecorKey } from "@/shared/types";
import { CardDecorations } from "@/client/components/card/CardDecorations";
import { DecorSwatch } from "@/client/components/card/DecorIllustration";
import { cn } from "@/shared/utils/cn";
import { contrastText } from "@/shared/utils/color";

type TemplateItem = (typeof templates)[number];

const THUMB_THEMES: Record<string, CardTheme> = Object.fromEntries(
  templates.map((t) => [
    t.id,
    {
      templateId: t.id,
      styleId: t.id,
      backgroundId: "white-clean",
      decor: [...t.defaultDecor],
      primaryColor: "#475569",
      shapes: Object.fromEntries(
        t.shapes.map((s) => [s.id, s.id === "editorial-frame"]),
      ),
      avatarSize: "md",
      avatarShape: "circle",
      buttonStyle: "soft",
      showDecor: true,
      decorOpacity: t.defaultDecorOpacity,
    } satisfies CardTheme,
  ]),
);

const THUMB_STYLE = {
  background: "#FFFFFF",
  "--card-background": "#FFFFFF",
  "--card-accent": "#475569",
  "--thumb-color": "#475569",
} as React.CSSProperties;

const TemplateThumbnailTile = memo(function TemplateThumbnailTile({
  template: t,
  selected,
  onSelect,
}: {
  template: TemplateItem;
  selected: boolean;
  onSelect: (template: TemplateItem) => void;
}) {
  const thumbTheme = THUMB_THEMES[t.id];
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn("template-tile", selected && "selected")}
      onClick={() => onSelect(t)}
    >
      <span
        className={`template-art qtm-art-${t.id}`}
        aria-hidden="true"
        style={THUMB_STYLE}
      >
        <CardDecorations theme={thumbTheme} variant="thumb" />
        <span className="art-brand">QTM</span>
        <i className="art-avatar" />
        <span className="art-name">NGUYỄN MINH AN</span>
        <i className="art-rule" />
        <span className="art-role">Chuyên viên phát triển</span>
        <span className="art-buttons">
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className="template-tile-caption">
        <strong>{t.name}</strong>
        <small>{t.description}</small>
      </span>
      {selected && (
        <span className="template-selected">
          <Check size={12} />
        </span>
      )}
    </button>
  );
});

export const ThemeCustomizer = memo(function ThemeCustomizer({
  theme: rawTheme,
  onChange,
}: {
  theme: CardTheme;
  onChange: (theme: CardTheme) => void;
}) {
  const theme = migrateCardTheme(rawTheme);
  const [hexDraft, setHexDraft] = useState(theme.primaryColor);
  const [hexError, setHexError] = useState("");

  const set = useCallback(
    (patch: Partial<CardTheme>) => {
      if (patch.primaryColor) {
        setHexDraft(patch.primaryColor);
        setHexError("");
      }
      onChange({ ...migrateCardTheme(rawTheme), ...patch });
    },
    [onChange, rawTheme],
  );

  const handleSelectTemplate = useCallback(
    (t: TemplateItem) => {
      const current = migrateCardTheme(rawTheme);
      set({
        templateId: t.id,
        styleId: t.id,
        backgroundId: t.defaultBackgroundId || current.backgroundId,
        decor: [...t.defaultDecor],
        showDecor: true,
        decorOpacity: t.defaultDecorOpacity,
        shapes: Object.fromEntries(
          t.shapes.map((s) => [s.id, s.id === "editorial-frame"]),
        ),
      });
    },
    [rawTheme, set],
  );

  const handleSelectDecor = useCallback((id: DecorKey | "none") => {
    set({
      decor: id === "none" ? [] : [id],
      ...(id === "cyber-magazine" ? {
        primaryColor: "#0F4C75",
        backgroundId: "white-clean",
        paletteId: "default-qtm",
        buttonStyle: "filled" as const,
        showDecor: true,
      } : {}),
    });
  }, [set]);

  const template = getTemplate(theme.templateId);
  const decorOpacity = theme.decorOpacity ?? template.defaultDecorOpacity;

  return (
    <section className="panel form-section theme-customizer">
      <h2>
        <Palette size={18} />
        <span>03</span>Thiết kế danh thiếp & hồ sơ
      </h2>
      <p className="theme-intro">
        Chọn phong cách của bạn. Thiết kế này cũng là giao diện trang hồ sơ khi
        khách quét mã QR.
      </p>

      <div className="theme-group-heading">
        <h3>Phong cách thiết kế</h3>
        <span>{templates.length} mẫu</span>
      </div>
      <p className="theme-help mb-3">
        Phong cách quyết định cấu trúc, hình dạng nút, kiểu chữ, khung ảnh và đường kẻ (nền trắng &amp; màu trung tính).
      </p>
      <div className="template-gallery">
        {templates.map((t) => (
          <TemplateThumbnailTile
            key={t.id}
            template={t}
            selected={theme.templateId === t.id}
            onSelect={handleSelectTemplate}
          />
        ))}
      </div>

      {/* BƯỚC: BỘ PHỐI MÀU (PALETTE) */}
      <div className="customizer-section">
        <div className="theme-group-heading">
          <h3 className="inline-flex items-center gap-1.5">
            <Palette size={14} />
            Bộ phối màu (Palette)
          </h3>
          <span>{palettes.length} phối màu</span>
        </div>
        <p className="theme-help mb-3">
          Chọn bộ màu để đồng bộ toàn bộ: nền, nút, viền, chữ nhấn và họa tiết. Đổi màu không làm đổi hình dạng phong cách.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {palettes.map((p) => {
            const isSelected =
              theme.backgroundId === p.backgroundId &&
              theme.primaryColor.toLowerCase() === p.primaryColor.toLowerCase();
            return (
              <button
                type="button"
                key={p.id}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer relative",
                  isSelected
                    ? "border-cyan-400 bg-white/10 ring-1 ring-cyan-400/40"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                )}
                onClick={() =>
                  set({
                    backgroundId: p.backgroundId,
                    primaryColor: p.primaryColor,
                    paletteId: p.id,
                  })
                }
              >
                <div
                  className="h-10 w-full rounded-lg border border-black/10 flex items-center justify-center relative overflow-hidden mb-2 shadow-xs"
                  style={{ background: p.backgroundCss }}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-white/60 shadow-xs flex items-center justify-center"
                    style={{ background: p.primaryColor }}
                  >
                    {isSelected && <Check size={11} className="text-white" />}
                  </span>
                </div>
                <strong className="text-xs font-semibold text-white truncate">
                  {p.name}
                </strong>
                <span className="text-[10px] text-slate-400 truncate">
                  {p.primaryColor}
                </span>
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>



      {/* BƯỚC: HỌA TIẾT NỀN */}
      <div className="customizer-section">
        <div className="theme-group-heading">
          <h3 className="inline-flex items-center gap-1.5">
            <Sparkles size={13} />
            Họa tiết nền
          </h3>
          <span>{decorOptions.length} lựa chọn</span>
        </div>
        <p className="theme-help mb-3">
          Chọn đúng 1 họa tiết nhẹ nhàng viền quanh rìa thẻ. Thành phố luôn là chân trang cố định.
        </p>
        <div className="decor-options" role="radiogroup" aria-label="Họa tiết nền (chọn 1)">
          {decorOptions.map((option) => {
            const isSelected =
              option.id === "none"
                ? theme.decor.length === 0
                : theme.decor[0] === option.id;
            return (
              <label
                key={option.id}
                className={cn("decor-option cursor-pointer", isSelected && "selected")}
                onClick={() => handleSelectDecor(option.id)}
              >
                <input
                  type="radio"
                  name="card-decor-selection"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleSelectDecor(option.id)}
                />
                <span className="decor-thumbnail pointer-events-none" style={{ color: theme.primaryColor }}>
                  {option.id === "none" ? (
                    <svg viewBox="0 0 80 50" aria-hidden="true">
                      <path d="M29 36L51 14" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    <DecorSwatch decor={option.id} primaryColor={theme.primaryColor} />
                  )}
                </span>
                <span className="pointer-events-none">{option.name}</span>
                {isSelected && <Check className="decor-tick" size={14} />}
              </label>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="decor-opacity-range" className="control-label">
              Độ đậm họa tiết
            </label>
            <span className="text-[11px] font-bold text-[#22D3EE]">
              {Math.min(60, decorOpacity)}%
            </span>
          </div>
          <input
            id="decor-opacity-range"
            type="range"
            min={0}
            max={60}
            step={5}
            value={Math.min(60, decorOpacity)}
            onChange={(e) => set({ decorOpacity: Number(e.target.value) })}
            className="w-full accent-[#22D3EE] cursor-pointer h-2 rounded-lg bg-white/10"
          />
          <div className="flex justify-between text-[9px] text-[#7A8AA8] mt-1">
            <span>0% (Ẩn)</span>
            <span>35% (Mặc định)</span>
            <span>60% (Tối đa)</span>
          </div>
        </div>
      </div>

      {/* BƯỚC: MÀU CHỦ ĐẠO */}
      <div className="customizer-section">
        <div className="theme-group-heading">
          <h3>Màu chủ đạo</h3>
          <span>{colorPresets.length} màu</span>
        </div>
        <div className="color-gallery">
          {colorPresets.map((color) => (
            <button
              type="button"
              key={color.hex}
              title={`${color.name} · ${color.hex}`}
              aria-label={`${color.name} ${color.hex}`}
              aria-pressed={
                theme.primaryColor.toLowerCase() === color.hex.toLowerCase()
              }
              className={cn(
                "color-chip",
                theme.primaryColor.toLowerCase() === color.hex.toLowerCase() &&
                  "selected",
              )}
              style={{ background: color.hex, color: contrastText(color.hex) }}
              onClick={() => set({ primaryColor: color.hex })}
            >
              {theme.primaryColor.toLowerCase() === color.hex.toLowerCase() && (
                <Check size={15} />
              )}
            </button>
          ))}
        </div>
        <div className="hex-editor">
          <label className="color-picker-label">
            Màu tùy chọn
            <input
              type="color"
              aria-label="Chọn màu chủ đạo"
              value={theme.primaryColor}
              onChange={(e) => set({ primaryColor: e.target.value })}
            />
          </label>
          <div className="field">
            <label htmlFor="theme-hex">Mã màu HEX</label>
            <input
              id="theme-hex"
              value={hexDraft}
              maxLength={7}
              spellCheck={false}
              aria-invalid={!!hexError}
              aria-describedby={hexError ? "theme-hex-error" : undefined}
              onChange={(e) => {
                const value = e.target.value;
                setHexDraft(value);
                if (/^#[0-9a-f]{6}$/i.test(value)) set({ primaryColor: value });
              }}
              onBlur={() => {
                if (!/^#[0-9a-f]{6}$/i.test(hexDraft))
                  setHexError("Nhập mã # và 6 ký tự, ví dụ #0F4C75.");
              }}
            />
            {hexError && (
              <span className="field-error" id="theme-hex-error">
                {hexError}
              </span>
            )}
          </div>
        </div>
        <p className="theme-help">
          Màu chữ tự cân bằng độ tương phản trên nền sáng và nền tối.
        </p>
      </div>

    </section>
  );
});
