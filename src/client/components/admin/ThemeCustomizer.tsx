"use client";
import { useState } from "react";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { Palette, Check, WandSparkles, Sparkles } from "lucide-react";
import {
  templates,
  backgrounds,
  decorOptions,
  colorPresets,
  getTemplate,
} from "@/shared/constants/card-themes";
import type { CardTheme } from "@/shared/types/employee";
import { CardDecorations, DecorArtwork } from "@/client/components/card/CardDecorations";
import { Switch } from "@/client/components/ui/Switch";
import { cn } from "@/shared/utils/cn";
import { contrastText } from "@/shared/utils/color";

export function ThemeCustomizer({
  theme: rawTheme,
  onChange,
}: {
  theme: CardTheme;
  onChange: (theme: CardTheme) => void;
}) {
  const theme = migrateCardTheme(rawTheme);
  const [hexDraft, setHexDraft] = useState(theme.primaryColor);
  const [hexError, setHexError] = useState("");

  const set = (patch: Partial<CardTheme>) => {
    if (patch.primaryColor) {
      setHexDraft(patch.primaryColor);
      setHexError("");
    }
    onChange({ ...theme, ...patch });
  };

  const template = getTemplate(theme.templateId);
  const showDecor = theme.showDecor ?? true;
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
      <div className="template-gallery">
        {templates.map((t) => {
          const thumbTheme: CardTheme = {
            templateId: t.id,
            backgroundId: t.defaultBackgroundId,
            decor: [...t.defaultDecor],
            primaryColor: t.defaultColor,
            shapes: Object.fromEntries(t.shapes.map((s) => [s.id, s.id === "editorial-frame"])),
            avatarSize: "md",
            avatarShape: "circle",
            buttonStyle: "soft",
            showDecor: true,
            decorOpacity: t.defaultDecorOpacity,
          };
          return (
            <button
              type="button"
              key={t.id}
              aria-pressed={theme.templateId === t.id}
              className={cn(
                "template-tile",
                theme.templateId === t.id && "selected",
              )}
              onClick={() =>
                set({
                  templateId: t.id,
                  backgroundId: t.defaultBackgroundId,
                  primaryColor: t.defaultColor,
                  decor: [...t.defaultDecor],
                  showDecor: true,
                  decorOpacity: t.defaultDecorOpacity,
                  shapes: Object.fromEntries(t.shapes.map((s) => [s.id, s.id === "editorial-frame"])),
                })
              }
            >
              <span
                className={`template-art art-${t.id}`}
                style={
                  {
                    "--thumb-color": t.defaultColor,
                  } as React.CSSProperties
                }
              >
                <CardDecorations theme={thumbTheme} variant="thumb" />
                <span className="art-brand">QTM</span>
                <i className="art-avatar" />
                <span className="art-name" />
                <span className="art-role" />
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
              {theme.templateId === t.id && (
                <span className="template-selected">
                  <Check size={12} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="suggested-palette"
        onClick={() =>
          set({
            backgroundId: template.defaultBackgroundId,
            primaryColor: template.defaultColor,
            decor: [...template.defaultDecor],
            showDecor: true,
            decorOpacity: template.defaultDecorOpacity,
            shapes: Object.fromEntries(template.shapes.map((s) => [s.id, s.id === "editorial-frame"])),
          })
        }
      >
        <WandSparkles size={15} />
        <span>Áp dụng phối màu & họa tiết chuẩn cho mẫu {template.name}</span>
      </button>

      {/* BƯỚC: NỀN HỒ SƠ */}
      <div className="customizer-section">
        <div className="theme-group-heading">
          <h3>Nền hồ sơ</h3>
          <span>{backgrounds.length} lựa chọn</span>
        </div>
        <div className="background-gallery">
          {backgrounds.map((b) => (
            <button
              type="button"
              key={b.id}
              aria-label={b.name}
              aria-pressed={theme.backgroundId === b.id}
              className={cn(
                "background-tile",
                theme.backgroundId === b.id && "selected",
              )}
              onClick={() => set({ backgroundId: b.id })}
            >
              <span style={{ background: b.css }}>
                {theme.backgroundId === b.id && (
                  <Check
                    size={15}
                    style={{ color: b.dark ? "#fff" : "#155e75" }}
                  />
                )}
              </span>
              <small>{b.name}</small>
            </button>
          ))}
        </div>
        {template.dark && (
          <p className="theme-help">
            Mẫu {template.name} tự động tối ưu nền tối & ánh sáng điểm nhấn để
            chữ luôn nổi bật.
          </p>
        )}
      </div>

      {/* BƯỚC: HỌA TIẾT NỀN & CHI TIẾT TRANG TRÍ */}
      <div className="customizer-section">
        <div className="theme-group-heading">
          <h3 className="inline-flex items-center gap-1.5">
            <Sparkles size={13} />
            Họa tiết nền
          </h3>
        </div>
        <div className="decor-suggestion">
          <span>Gợi ý cho mẫu này: {template.defaultDecor.map((key) => decorOptions.find((option) => option.id === key)?.name).join(" + ")}</span>
          <button type="button" onClick={() => set({ decor: [...template.defaultDecor], decorOpacity: template.defaultDecorOpacity })}>Áp dụng gợi ý</button>
        </div>
        <div className="decor-options" role="group" aria-label="Họa tiết nền (có thể chọn nhiều)">
          {decorOptions.map((option) => {
            const selected = option.id === "none" ? theme.decor.length === 0 : theme.decor.includes(option.id);
            return (
              <label key={option.id} className={cn("decor-option", selected && "selected")}>
                <input type="checkbox" checked={selected} onChange={() => {
                  const id = option.id;
                  set({ decor: id === "none" ? [] : selected ? theme.decor.filter((key) => key !== id) : [...theme.decor, id] });
                }} />
                <span className="decor-thumbnail" style={{ color: theme.primaryColor }}>
                  {option.id === "none" ? <svg viewBox="0 0 80 50" aria-hidden="true"><path d="M29 36L51 14" stroke="currentColor" strokeWidth="1" /></svg> : <DecorArtwork decor={option.id} seed={theme.templateId} />}
                </span>
                <span>{option.name}</span>
                {selected && <Check className="decor-tick" size={14} />}
              </label>
            );
          })}
        </div>
        <p className="theme-help">Có thể kết hợp nhiều họa tiết. Độ đậm chỉ thay đổi độ trong suốt.</p>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="decor-opacity-range" className="control-label">
              Độ đậm họa tiết
            </label>
            <span className="text-[11px] font-bold text-[#22D3EE]">
              {decorOpacity}%
            </span>
          </div>
          <input
            id="decor-opacity-range"
            type="range"
            min={0}
            max={100}
            step={5}
            value={decorOpacity}
            onChange={(e) => set({ decorOpacity: Number(e.target.value) })}
            className="w-full accent-[#22D3EE] cursor-pointer h-2 rounded-lg bg-white/10"
          />
          <div className="flex justify-between text-[9px] text-[#7A8AA8] mt-1">
            <span>0% (Ẩn)</span>
            <span>50% (Dịu nhẹ)</span>
            <span>100% (Rõ nét)</span>
          </div>
        </div>
      </div>

      <div className="customizer-section">
        <div className="theme-group-heading">
          <h3>Chi tiết trang trí</h3>
          <span>{showDecor ? "Đang bật" : "Đang tắt"}</span>
        </div>

        <div className="shape-row">
          <div>
            <strong className="text-[11px] text-white block">
              Hiển thị họa tiết góc & khung viền ({template.name})
            </strong>
          </div>
          <Switch
            label="Hiển thị họa tiết trang trí"
            checked={showDecor}
            onChange={(value) => set({ showDecor: value })}
          />
        </div>

        {showDecor &&
          template.shapes.map((s) => (
            <div className="shape-row" key={s.id}>
              <span>{s.label}</span>
              <Switch
                label={s.label}
                checked={theme.shapes[s.id] === true}
                onChange={(value) =>
                  set({ shapes: { ...theme.shapes, [s.id]: value } })
                }
              />
            </div>
          ))}
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

      {/* BƯỚC: CÀI ĐẶT AVATAR & NÚT */}
      <div className="customizer-section settings-grid">
        <label>
          Kích thước ảnh đại diện
          <select
            className="control-select"
            value={theme.avatarSize}
            onChange={(e) =>
              set({ avatarSize: e.target.value as CardTheme["avatarSize"] })
            }
          >
            <option value="sm">Nhỏ</option>
            <option value="md">Vừa</option>
            <option value="lg">Lớn</option>
          </select>
        </label>
        <label>
          Hình dáng ảnh đại diện
          <select
            className="control-select"
            value={theme.avatarShape}
            onChange={(e) =>
              set({ avatarShape: e.target.value as CardTheme["avatarShape"] })
            }
          >
            <option value="circle">Hình tròn</option>
            <option value="rounded">Bo góc</option>
          </select>
        </label>
      </div>
    </section>
  );
}
