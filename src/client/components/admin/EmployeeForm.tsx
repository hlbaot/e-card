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
import { EmployeeFormLayout } from "./EmployeeFormLayout";
import { PreviewToggleButton } from "./PreviewToggleButton";
import { websiteUrl } from "@/shared/utils/vcard";

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
  const [errors, setErrors] = useState<Partial<Record<TextField, string>>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const desktopToggleRef = useRef<HTMLButtonElement>(null);
  const mobileFabRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const { create, update, uploadAvatar } = useEmployeeMutations();
  const toast = useToast();
  const router = useRouter();

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
            <span className="sr-only"> (bắt buộc)</span>
          </>
        )}
      </label>
      <input
        id={key}
        type={type}
        style={key === "fullName" ? { textTransform: "uppercase" } : undefined}
        required={requiredFields.includes(key)}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => set(key, e.target.value)}
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
    setFormError("");
    const next: Partial<Record<TextField, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Vui lòng nhập họ tên.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Vui lòng nhập địa chỉ thư điện tử hợp lệ.";
    if (!/^(?=.*\d)[+\d][\d +]*$/.test(form.phone.trim()))
      next.phone = "SĐT chỉ gồm số, dấu cách và dấu +.";
    if (form.website.trim()) {
      const url = websiteUrl(form.website.trim());
      if (!url || !new URL(url).hostname.includes("."))
        next.website = "Vui lòng nhập địa chỉ trang web hợp lệ.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      const msg = "Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.";
      setFormError(msg);
      toast(msg, "error");
      return;
    }
    setBusy(true);
    try {
      const clean = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        website: form.website.trim(),
        slogan: form.slogan.trim(),
      };
      const saved = employee
        ? await update(employee.id, clean)
        : await create(clean);
      toast(
        employee
          ? "Đã lưu thay đổi nhân viên thành công"
          : "Đã tạo nhân viên và danh thiếp thành công",
      );
      router.push(`/admin/employees/${saved.id}`);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Không thể lưu dữ liệu. Vui lòng thử lại.";
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
          Nhân viên
        </Link>
        <span>/</span>
        <span>{employee ? "Chỉnh sửa" : "Thêm mới"}</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{employee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h1>
          <p>Thông tin chuyên nghiệp. Dấu ấn của riêng bạn.</p>
        </div>
        <span className="demo-badge">THIẾT KẾ HỒ SƠ</span>
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
          <span>01</span>Thông tin nhân viên
        </h2>
        <div className="avatar-upload">
          <div className="relative inline-flex items-center">
            <label
              className="group relative inline-flex cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-[#071026]"
              title={uploading ? "Đang tải ảnh…" : "Nhấn để tải hoặc đổi ảnh đại diện"}
              aria-label={uploading ? "Đang tải ảnh…" : "Tải hoặc đổi ảnh đại diện"}
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
                    toast("Chọn ảnh JPG, PNG hoặc WebP tối đa 2 MB", "error");
                    return;
                  }
                  const input = e.currentTarget;
                  setUploading(true);
                  try {
                    set("avatarUrl", await uploadAvatar(file));
                    toast("Đã tải ảnh lên");
                  } catch (error) {
                    toast(
                      error instanceof Error ? error.message : "Không thể tải ảnh",
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
                aria-label="Xóa ảnh đại diện"
                title="Xóa ảnh đại diện"
                onClick={() => set("avatarUrl", "")}
                className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/12 text-rose-400 transition-all hover:border-rose-400/60 hover:bg-rose-500/22 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div>
            <p className="!mt-0 text-xs font-medium text-slate-300">
              Ảnh đại diện
            </p>
            <p>JPG, PNG hoặc WebP · Tối đa 2 MB</p>
          </div>
        </div>
        <div className="fields">
          {input("fullName", "Họ và tên", "Nguyễn Văn An", true)}
          {input("position", "Chức vụ", "Quản lý dự án", true)}
          {input("company", "Tên công ty", "", true)}
          {input("companyShort", "Tên công ty viết tắt", "", true)}
          {input("phone", "Số điện thoại", "0900 000 000", false, "tel")}
          {input("email", "Thư điện tử", "name@qtmmedia.vn", false, "email")}
          {input("zalo", "Zalo", "0900000000")}
          {input("website", "Trang web", "qtmmedia.vn")}
          {input("slogan", "Khẩu hiệu", "Your Journey Partner", true)}
          {employee && (
            <div className="field full">
              <label htmlFor="slug">Đường dẫn hồ sơ · cố định</label>
              <input id="slug" readOnly value={employee.slug} />
              <small>
                Đường dẫn và mã QR được giữ nguyên khi cập nhật thông tin.
              </small>
            </div>
          )}
        </div>
      </section>

      <section className="panel form-section">
        <h2>
          <Building2 size={18} />
          <span>02</span>Thông tin văn phòng
        </h2>
        {form.offices.map((office, index) => (
          <div className="office-row" key={index}>
            <div className="field">
              <label htmlFor={`office-label-${index}`}>
                Văn phòng {index + 1}
              </label>
              <input
                id={`office-label-${index}`}
                value={office.label}
                placeholder="Tên văn phòng"
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
                Địa chỉ văn phòng {index + 1}
              </label>
              <textarea
                id={`office-address-${index}`}
                value={office.address}
                placeholder="Địa chỉ"
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
              aria-label={`Xóa văn phòng ${index + 1}`}
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
          Thêm văn phòng
        </button>
      </section>

      <ThemeCustomizer
        theme={form.theme}
        onChange={handleThemeChange}
      />

      <section className="panel form-section">
        <h2>
          <ShieldCheck size={18} />
          <span>04</span>Hiển thị
        </h2>

        <div className="shape-row !mt-0">
          <div>
            <strong className="text-sm text-[var(--ink)]">
              Hiển thị danh thiếp công khai
            </strong>
            <p className="field-note mt-1">
              Cho phép người dùng truy cập danh thiếp qua đường dẫn và mã QR.
            </p>
          </div>
          <Switch
            label="Hiển thị danh thiếp công khai"
            checked={form.isActive}
            onChange={(v) => set("isActive", v)}
          />
        </div>
      </section>

      {employee && (
        <section className="panel form-section">
          <h2>
            <QrCode size={18} />
            <span>05</span>QR / Liên kết cố định
          </h2>
          <QRPanel slug={employee.slug} />
        </section>
      )}
    </>
  );

  const actionBar = (
    <div className="flex items-center justify-between gap-3">
      <Link href="/admin/employees" className="btn btn-secondary">
        Hủy
      </Link>
      <button type="submit" className="btn btn-primary" disabled={busy || uploading}>
        {busy ? <Spinner /> : <Save size={16} />}
        {busy ? "Đang lưu…" : employee ? "Lưu thay đổi" : "Tạo nhân viên"}
      </button>
    </div>
  );

  return (
    <>
      <LoadingOverlay show={busy} label="Đang lưu…" />
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
            label="Xem trước"
            onClick={handleOpenMobilePreview}
          />
        }
        onSubmit={submit}
      />

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
