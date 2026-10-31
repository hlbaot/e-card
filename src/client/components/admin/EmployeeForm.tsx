"use client";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  UserRound,
  Building2,
  Plus,
  Trash2,
  Pencil,
  Save,
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { DEFAULT_PUBLIC_FIELDS, getPublicFields } from "@/shared/types";
import type { CardTheme, Employee, EmployeeInput } from "@/shared/types";
import { useEmployeeMutations } from "@/client/hooks/useEmployeeMutations";
import { Avatar } from "@/client/components/ui/Avatar";
import { Switch } from "@/client/components/ui/Switch";
import { useToast } from "@/client/components/ui/Toast";
import { Alert } from "@/client/components/ui/Alert";
import { Spinner } from "@/client/components/ui/Spinner";
import { LoadingOverlay } from "@/client/components/ui/LoadingOverlay";
import { BusinessCardPicker } from "./BusinessCardPicker";
import { EmployeeFormLayout } from "./EmployeeFormLayout";
import { PreviewToggleButton } from "./PreviewToggleButton";
import { formatPhone, normalizePhone } from "@/shared/utils/phone";
import { websiteUrl } from "@/shared/utils/vcard";
import { translateErrorMessage } from "@/i18n/error-map";

const ThemeCustomizer = dynamic(() =>
  import("./ThemeCustomizer").then((m) => m.ThemeCustomizer),
);
const LivePreviewPanel = dynamic(() =>
  import("./LivePreviewPanel").then((m) => m.LivePreviewPanel),
);
const PreviewModal = dynamic(
  () => import("./PreviewModal").then((m) => m.PreviewModal),
  { ssr: false },
);
const QRPanel = dynamic(
  () => import("@/client/components/card/QRPanel").then((m) => m.QRPanel),
  { ssr: false },
);

const blank: EmployeeInput = {
  company: "",
  companyShort: "",
  website: "",
  slogan: "Your Journey Partner",
  isActive: true,
  fullName: "",
  position: "",
  avatarUrl: "",
  phone: "",
  email: "",
  zalo: "",
  allowIndexing: false,
  publicFields: { ...DEFAULT_PUBLIC_FIELDS },
  offices: [],
  theme: {
    templateId: "bubble-blue", backgroundId: "white-clean", primaryColor: "#0F4C75",
    avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft",
    decor: ["blobs"], shapes: {}, showDecor: true, decorOpacity: 35,
  },
};

type TextField =
  | "fullName"
  | "position"
  | "company"
  | "companyShort"
  | "phone"
  | "email"
  | "zalo"
  | "website"
  | "slogan";

const requiredFields: readonly TextField[] = ["fullName", "phone", "email"];


function formFingerprint(input: EmployeeInput) {
  // Compare editable fields only; ignore response metadata and phone display spacing.
  const editable = Object.fromEntries(Object.keys(blank).map((key) => [key, input[key as keyof EmployeeInput]]));
  editable.phone = normalizePhone(input.phone);
  editable.publicFields = getPublicFields(input);
  editable.theme = { ...migrateCardTheme(input.theme), businessCardType: input.theme.businessCardType ?? "qtm" };
  return JSON.stringify(editable, (_key, value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
    }
    return value;
  });
}

export function EmployeeForm({ employee }: { employee?: Employee }) {
  const [form, setForm] = useState<EmployeeInput>(() => {
    const source = structuredClone(employee || blank);
    return {
      ...source,
      allowIndexing: source.allowIndexing ?? false,
      publicFields: getPublicFields(source),
      theme: migrateCardTheme(source.theme),
    };
  });
  const [savedFingerprint, setSavedFingerprint] = useState(() => formFingerprint(form));
  const isDirty = formFingerprint(form) !== savedFingerprint;
  const [cardPickerEmployee, setCardPickerEmployee] = useState<Employee | null>(null);
  const [errors, setErrors] = useState<Partial<Record<TextField, string>>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const fullNameComposingRef = useRef(false);
  const desktopToggleRef = useRef<HTMLButtonElement>(null);
  const mobileFabRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const { create, update, uploadAvatar } = useEmployeeMutations();
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations("admin.form");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const tToast = useTranslations("toast");
  const tRoot = useTranslations();

  const set = <K extends keyof EmployeeInput>(
    key: K,
    value: EmployeeInput[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (formError) setFormError("");
    if (errors[key as TextField]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as TextField];
        return next;
      });
    }
  };

  const handleThemeChange = useCallback((theme: CardTheme) => {
    setForm((f) => ({ ...f, theme }));
  }, []);

  const handleOpenDesktopPreview = useCallback(() => {
    lastTriggerRef.current = desktopToggleRef.current;
    setPreviewModalOpen(true);
  }, []);

  const handleOpenMobilePreview = useCallback(() => {
    lastTriggerRef.current = mobileFabRef.current;
    setPreviewModalOpen(true);
  }, []);

  const handleClosePreviewModal = useCallback(() => {
    setPreviewModalOpen(false);
  }, []);

  const preview: Employee = useMemo(
    () => ({
      ...form,
      id: employee?.id || "preview",
      slug: employee?.slug || "xem-truoc",
      createdAt: employee?.createdAt || "",
      updatedAt: employee?.updatedAt || "",
    }),
    [form, employee?.id, employee?.slug, employee?.createdAt, employee?.updatedAt],
  );
  const deferredPreview = useDeferredValue(preview);

  const uppercaseFullName = (element: HTMLInputElement) => {
    const value = element.value;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const direction = element.selectionDirection ?? undefined;
    set("fullName", value.toLocaleUpperCase("vi-VN"));
    if (start !== null && end !== null) {
      const nextStart = value.slice(0, start).toLocaleUpperCase("vi-VN").length;
      const nextEnd = value.slice(0, end).toLocaleUpperCase("vi-VN").length;
      requestAnimationFrame(() => {
        if (document.activeElement === element) element.setSelectionRange(nextStart, nextEnd, direction);
      });
    }
  };

  const input = (
    key: TextField,
    label: string,
    placeholder = "",
    full = false,
    type = "text",
  ) => (
    <div className={`field ${full ? "full" : ""}`}>
      <label htmlFor={key}>
        {label}
        {requiredFields.includes(key) && (
          <>
            <span className="text-red-500" aria-hidden="true"> *</span>
            <span className="sr-only"> ({tCommon("required")})</span>
          </>
        )}
      </label>
      <input
        id={key}
        type={type}
        style={key === "fullName" ? { textTransform: "uppercase" } : undefined}
        autoCapitalize={key === "fullName" ? "characters" : undefined}
        onCompositionStart={key === "fullName" ? () => { fullNameComposingRef.current = true; } : undefined}
        onCompositionEnd={key === "fullName" ? (e) => {
          fullNameComposingRef.current = false;
          uppercaseFullName(e.currentTarget);
        } : undefined}
        required={requiredFields.includes(key)}
        value={key === "phone" ? formatPhone(form.phone) : form[key]}
        placeholder={placeholder}
        onChange={(e) => {
          if (key === "fullName") {
            if (fullNameComposingRef.current || (e.nativeEvent as InputEvent).isComposing) {
              set(key, e.target.value);
            } else {
              uppercaseFullName(e.currentTarget);
            }
            return;
          }
          if (key !== "phone") { set(key, e.target.value); return; }
          const element = e.currentTarget;
          const cursor = element.selectionStart ?? element.value.length;
          let offset = normalizePhone(element.value.slice(0, cursor)).length;
          let value = normalizePhone(element.value);
          const inputType = (e.nativeEvent as InputEvent).inputType;
          // Backspace/delete on a generated separator should remove a digit as usual.
          if (value === normalizePhone(form.phone) && inputType?.startsWith("delete")) {
            const index = inputType === "deleteContentBackward" ? offset - 1 : offset;
            if (index >= 0) {
              value = value.slice(0, index) + value.slice(index + 1);
              offset = Math.max(0, index);
            }
          }
          set("phone", value);
          const formatted = formatPhone(value);
          let nextCursor = 0;
          while (nextCursor < formatted.length && offset > 0) {
            if (formatted[nextCursor] !== " ") offset--;
            nextCursor++;
          }
          requestAnimationFrame(() => {
            if (document.activeElement === element) element.setSelectionRange(nextCursor, nextCursor);
          });
        }}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
      />
      {errors[key] && (
        <span role="alert" id={`${key}-error`} className="field-error">
          {errors[key]}
        </span>
      )}
    </div>
  );

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || uploading || cardPickerEmployee || (employee && !isDirty)) return;
    setFormError("");
    const next: Partial<Record<TextField, string>> = {};
    if (!form.fullName.trim()) next.fullName = tValidation("fullNameRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = tValidation("emailInvalid");
    if (!/^(?=.*\d)[+\d][\d +]*$/.test(form.phone.trim()))
      next.phone = tValidation("phoneInvalid");
    if (form.website.trim()) {
      const url = websiteUrl(form.website.trim());
      if (!url || !new URL(url).hostname.includes("."))
        next.website = tValidation("websiteInvalid");
    }
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      const msg = tValidation("formRequired");
      setFormError(msg);
      toast(msg, "error");
      return;
    }
    const clean = {
      ...form,
      fullName: form.fullName.trim().toLocaleUpperCase("vi-VN"),
      email: form.email.trim(),
      phone: normalizePhone(form.phone),
      website: form.website.trim(),
      slogan: form.slogan.trim(),
    };
    if (!employee) {
      // Keep the new employee in memory until a card is explicitly confirmed.
      setCardPickerEmployee({ ...preview, ...clean });
      return;
    }
    setBusy(true);
    try {
      const saved = await update(employee.id, clean);
      setForm({ ...saved, theme: migrateCardTheme(saved.theme) });
      setSavedFingerprint(formFingerprint(saved));
      toast(tToast("employeeUpdated"));
      router.push(`/admin/employees/${saved.id}`);
      router.refresh();
    } catch (err) {
      const msg = translateErrorMessage(err, tRoot, "toast.saveError");
      setFormError(msg);
      toast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  const headerSection = (
    <>
      <div className="breadcrumb">
        <Link href="/admin/employees" className="button-row">
          <ArrowLeft size={13} />
          {t("breadcrumbEmployees")}
        </Link>
        <span>/</span>
        <span>{employee ? t("breadcrumbEdit") : t("breadcrumbNew")}</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{employee ? t("editTitle") : t("newTitle")}</h1>
          <p>{t("subtitle")}</p>
        </div>
        <span className="demo-badge">{t("badge")}</span>
      </div>
    </>
  );

  const formSections = (
    <>
      {formError && (
        <Alert
          variant="error"
          className="mb-5"
          onClose={() => setFormError("")}
        >
          {formError}
        </Alert>
      )}
      <section className="panel form-section">
        <h2>
          <UserRound size={18} />
          <span>01</span>{t("sectionEmployee")}
        </h2>
        <div className="avatar-upload">
          <div className="relative inline-flex items-center">
            <label
              className="group relative inline-flex cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-[#071026]"
              title={uploading ? t("avatarUploading") : t("avatarUploadTitle")}
              aria-label={uploading ? t("avatarUploading") : t("avatarUploadAria")}
            >
              <Avatar
                name={form.fullName}
                src={form.avatarUrl}
                color={form.theme.primaryColor}
                size={72}
              />
              <span
                aria-hidden="true"
                className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity duration-200 ${
                  uploading
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                }`}
              >
                {uploading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Pencil size={20} className="drop-shadow" />
                )}
              </span>
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (
                    !["image/jpeg", "image/png", "image/webp"].includes(
                      file.type,
                    ) ||
                    file.size > 2 * 1024 * 1024
                  ) {
                    toast(tValidation("avatarInvalid"), "error");
                    return;
                  }
                  const input = e.currentTarget;
                  setUploading(true);
                  try {
                    set("avatarUrl", await uploadAvatar(file));
                    toast(tToast("avatarUploaded"));
                  } catch (error) {
                    toast(
                      translateErrorMessage(error, tRoot, "toast.avatarUploadError"),
                      "error",
                    );
                  } finally {
                    setUploading(false);
                    input.value = "";
                  }
                }}
              />
            </label>
            {form.avatarUrl && (
              <button
                type="button"
                aria-label={t("avatarRemoveAria")}
                title={t("avatarRemoveAria")}
                onClick={() => set("avatarUrl", "")}
                className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/12 text-rose-400 transition-all hover:border-rose-400/60 hover:bg-rose-500/22 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div>
            <p className="!mt-0 text-xs font-medium text-slate-300">
              {t("avatarLabel")}
            </p>
            <p>{t("avatarHint")}</p>
          </div>
        </div>
        <div className="fields">
          {input("fullName", t("fullName"), t("fullNamePlaceholder"), true)}
          {input("position", t("position"), t("positionPlaceholder"), true)}
          {input("company", t("company"), "", true)}
          {input("companyShort", t("companyShort"), "", true)}
          {input("phone", t("phone"), t("phonePlaceholder"), false, "tel")}
          {input("email", t("email"), t("emailPlaceholder"), false, "email")}
          {input("zalo", t("zalo"), t("zaloPlaceholder"))}
          {input("website", t("website"), t("websitePlaceholder"))}
          {input("slogan", t("slogan"), t("sloganPlaceholder"), true)}
          {employee && <div className="field full">
            <span id="business-card-type-label" className="text-sm font-semibold">{t("businessCardTypeLabel")}</span>
            <div role="group" aria-labelledby="business-card-type-label" className="mt-2 grid grid-cols-2 gap-3">
              {([["qtm", t("cardTypeQtm")], ["an-ninh-mang", t("cardTypeCyber")]] as const).map(([value, label]) =>
                <button key={value} type="button" disabled={busy || uploading}
                  aria-pressed={(form.theme.businessCardType ?? "qtm") === value}
                  className={`btn ${(form.theme.businessCardType ?? "qtm") === value ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => set("theme", { ...form.theme, businessCardType: value })}>{label}</button>)}
            </div>
            <small>{t("businessCardTypeHelp")}</small>
          </div>}
          {employee && (
            <div className="field full">
              <label htmlFor="slug">{t("slugLabel")}</label>
              <input id="slug" readOnly value={employee.slug} />
              <small>
                {t("slugHelp")}
              </small>
            </div>
          )}
        </div>
      </section>

      <section className="panel form-section">
        <h2>
          <Building2 size={18} />
          <span>02</span>{t("sectionOffice")}
        </h2>
        {form.offices.map((office, index) => (
          <div className="office-row" key={index}>
            <div className="field">
              <label htmlFor={`office-label-${index}`}>
                {t("officeLabel")}
              </label>
              <input
                id={`office-label-${index}`}
                value={office.label}
                placeholder={t("officeNamePlaceholder")}
                onChange={(e) =>
                  set(
                    "offices",
                    form.offices.map((o, i) =>
                      i === index ? { ...o, label: e.target.value } : o,
                    ),
                  )
                }
              />
              <label className="sr-only" htmlFor={`office-address-${index}`}>
                {t("officeAddressAria", { index: index + 1 })}
              </label>
              <textarea
                id={`office-address-${index}`}
                value={office.address}
                placeholder={t("officeAddressPlaceholder")}
                rows={2}
                onChange={(e) =>
                  set(
                    "offices",
                    form.offices.map((o, i) =>
                      i === index ? { ...o, address: e.target.value } : o,
                    ),
                  )
                }
              />
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label={t("officeRemoveAria", { index: index + 1 })}
              onClick={() =>
                set(
                  "offices",
                  form.offices.filter((_, i) => i !== index),
                )
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            set("offices", [...form.offices, { label: "", address: "" }])
          }
        >
          <Plus size={15} />
          {t("addOffice")}
        </button>
      </section>

      <ThemeCustomizer
        theme={form.theme}
        onChange={handleThemeChange}
      />

      <section className="panel form-section">
        <h2>
          <ShieldCheck size={18} />
          <span>04</span>{t("sectionVisibility")}
        </h2>

        <div className="shape-row !mt-0">
          <div>
            <strong className="text-sm text-[var(--ink)]">
              {t("publicCardTitle")}
            </strong>
            <p className="field-note mt-1">
              {t("publicCardHelp")}
            </p>
          </div>
          <Switch
            label={t("publicCardTitle")}
            checked={form.isActive}
            onChange={(v) => set("isActive", v)}
          />
        </div>
      </section>

      {employee && (
        <section className="panel form-section">
          <h2>
            <QrCode size={18} />
            <span>05</span>{t("sectionQr")}
          </h2>
          <button type="button" className="btn btn-secondary mb-4" onClick={() => setCardPickerEmployee(preview)}>
            {t("switchExportCardWithType", {
              type: form.theme.businessCardType === "an-ninh-mang" ? t("cardTypeCyber") : t("cardTypeQtm"),
            })}
          </button>
          <QRPanel slug={employee.slug} />
        </section>
      )}
    </>
  );

  const actionBar = (
    <div className="flex items-center justify-between gap-3">
      <Link href="/admin/employees" className="btn btn-secondary">
        {tCommon("cancel")}
      </Link>
      {employee && <button type="button" className="btn btn-secondary" disabled={busy || uploading}
        onClick={() => setCardPickerEmployee(preview)}>{t("switchExportCard")}</button>}
      <button type="submit" className="btn btn-primary" disabled={busy || uploading || !!cardPickerEmployee || (!!employee && !isDirty)}>
        {busy ? <Spinner /> : <Save size={16} />}
        {busy ? (employee ? t("updating") : t("creating")) : employee ? tCommon("saveChanges") : t("createEmployee")}
      </button>
    </div>
  );

  return (
    <>
      <LoadingOverlay show={busy} label={employee ? t("updatingOverlay") : t("creatingOverlay")} />
      <EmployeeFormLayout
        header={headerSection}
        formContent={formSections}
        actionBar={actionBar}
        previewPanel={
          <LivePreviewPanel
            employee={deferredPreview}
            toggleButtonRef={desktopToggleRef}
            onOpenModal={handleOpenDesktopPreview}
          />
        }
        mobileFab={
          <PreviewToggleButton
            ref={mobileFabRef}
            variant="fab"
            label={t("previewFab")}
            onClick={handleOpenMobilePreview}
          />
        }
        onSubmit={submit}
      />

      {cardPickerEmployee && (
        <BusinessCardPicker
          employee={cardPickerEmployee}
          isNew={!employee}
          onClose={() => setCardPickerEmployee(null)}
          onSave={async (businessCardType) => {
            setBusy(true);
            try {
              const theme = { ...cardPickerEmployee.theme, businessCardType };
              const input = { ...cardPickerEmployee, theme };
              const saved = employee
                ? await update(employee.id, input)
                : await create(input);
              setForm({ ...saved, theme: migrateCardTheme(saved.theme) });
              setSavedFingerprint(formFingerprint(saved));
              setCardPickerEmployee(null);
              toast(employee ? tToast("cardTemplateUpdated") : tToast("employeeCreatedAndCardSaved"));
              router.push(`/admin/employees/${saved.id}`);
              router.refresh();
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
      {previewModalOpen && (
        <PreviewModal
          open={previewModalOpen}
          onClose={handleClosePreviewModal}
          employee={deferredPreview}
          returnFocusRef={lastTriggerRef}
        />
      )}
    </>
  );
}
