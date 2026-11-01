import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../src/messages/en.json";
import viMessages from "../src/messages/vi.json";
import {
  defaultLocale,
  locales,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isValidLocale,
  resolveLocale,
  getIntlLocale,
  type Locale,
} from "../src/i18n/config";
import { translateErrorMessage } from "../src/i18n/error-map";
import { writeClientLocaleCookie } from "../src/client/components/ui/LanguageSwitcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeTable } from "../src/client/components/admin/EmployeeTable";
import { TeamTable } from "../src/client/components/admin/dashboard/TeamTable";
import { TeamRowCard } from "../src/client/components/admin/dashboard/TeamRowCard";
import { EmployeePagination } from "../src/client/components/admin/EmployeePagination";
import { CardActions } from "../src/client/components/card/CardActions";
import { ActionGrid } from "../src/client/components/card/ActionGrid";
import { contactDownloadUrl } from "../src/shared/utils/vcard";
import { QrBusinessCard } from "../src/client/components/card/QrBusinessCard";
import { CardListContent } from "../src/client/components/card/CardListItem";
import { ContactList } from "../src/client/components/card/ContactList";
import { ProfileInfo } from "../src/client/components/card/ProfileInfo";
import { DEFAULT_PUBLIC_FIELDS, type Employee } from "../src/shared/types";
import { formatLocalizedDate, formatLocalizedNumber, localizeEmployee, localizeEmployeeName } from "../src/shared/utils/localize";

const sampleEmployee: Employee = {
  id: "emp-1",
  slug: "nguyen-van-an",
  fullName: "NGUYỄN VĂN AN",
  position: "Trưởng ban Hợp tác Phát triển",
  company: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM",
  companyShort: "QTM MediaTech",
  phone: "0912345678",
  email: "an.nguyen@qtmmedia.vn",
  zalo: "0912345678",
  website: "qtmmedia.vn",
  offices: [
    { label: "", address: "22 Ho Giam, Dong Da, Hanoi" },
  ],
  slogan: "Your Journey Partner",
  avatarUrl: "",
  isActive: true,
  allowIndexing: true,
  publicFields: { ...DEFAULT_PUBLIC_FIELDS },
  createdAt: "2026-10-25T00:00:00.000Z",
  updatedAt: "2026-10-25T00:00:00.000Z",
  theme: {
    templateId: "bubble-blue",
    styleId: "bubble-blue",
    businessCardType: "qtm",
    backgroundId: "white-clean",
    primaryColor: "#0F4C75",
    avatarSize: "lg",
    avatarShape: "circle",
    buttonStyle: "soft",
    decor: ["blobs"],
    shapes: {},
    showDecor: true,
    decorOpacity: 35,
  },
};

function renderWithLocale(locale: Locale, node: React.ReactNode): string {
  const messages = locale === "vi" ? viMessages : enMessages;
  return renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
      {node}
    </NextIntlClientProvider>,
  );
}

function lookupMessage(messages: Record<string, unknown>, keyPath: string): string {
  const value = keyPath.split(".").reduce<unknown>(
    (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    messages,
  );
  return typeof value === "string" ? value : keyPath;
}

test("default locale is English ('en') when no NEXT_LOCALE cookie is present", () => {
  assert.equal(defaultLocale, "en");
  assert.deepEqual(locales, ["en", "vi"]);
  assert.equal(LOCALE_COOKIE, "NEXT_LOCALE");
  assert.equal(resolveLocale(undefined), "en");
  assert.equal(resolveLocale(null), "en");
});

test("invalid NEXT_LOCALE cookie values safely fall back to English ('en')", () => {
  for (const invalid of ["", "fr", "de", "en-US", "vi-VN", "EN", "VI", "invalid", "123"]) {
    assert.equal(isValidLocale(invalid), false, `Expected '${invalid}' to be invalid`);
    assert.equal(resolveLocale(invalid), "en", `Expected '${invalid}' to fallback to 'en'`);
  }
  assert.equal(isValidLocale("en"), true);
  assert.equal(isValidLocale("vi"), true);
  assert.equal(resolveLocale("en"), "en");
  assert.equal(resolveLocale("vi"), "vi");
  assert.equal(getIntlLocale("en"), "en-US");
  assert.equal(getIntlLocale("vi"), "vi-VN");
});

test("switching language writes NEXT_LOCALE cookie with SameSite=Lax, Path=/ and 1-year Max-Age", () => {
  let writtenCookie = "";
  const prevDocument = globalThis.document;
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      get cookie() {
        return writtenCookie;
      },
      set cookie(val: string) {
        writtenCookie = val;
      },
    },
  });

  try {
    writeClientLocaleCookie("vi");
    assert.ok(writtenCookie.includes("NEXT_LOCALE=vi"));
    assert.ok(writtenCookie.includes("Path=/"));
    assert.ok(writtenCookie.includes(`Max-Age=${LOCALE_COOKIE_MAX_AGE}`));
    assert.ok(writtenCookie.includes("SameSite=Lax"));

    writeClientLocaleCookie("en");
    assert.ok(writtenCookie.includes("NEXT_LOCALE=en"));
  } finally {
    if (prevDocument === undefined) {
      delete (globalThis as { document?: unknown }).document;
    } else {
      Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: prevDocument,
      });
    }
  }
});

test("en.json and vi.json contain all required namespaces and matching keys", () => {
  const requiredNamespaces = [
    "common",
    "home",
    "auth",
    "admin",
    "card",
    "themeCustomizer",
    "errors",
    "validation",
    "toast",
    "meta",
  ];
  for (const ns of requiredNamespaces) {
    assert.ok(ns in enMessages, `Missing namespace '${ns}' in en.json`);
    assert.ok(ns in viMessages, `Missing namespace '${ns}' in vi.json`);
  }
  assert.equal(
    enMessages.common.cyberMagazineName,
    "Vietnam Cyber Security Magazine",
  );
  assert.equal(
    viMessages.common.cyberMagazineName,
    "Tạp chí điện tử An ninh mạng Việt Nam",
  );
});

test("public card components translate known fields and preserve custom DB fields", () => {
  const enCardSvg = renderWithLocale(
    "en",
    createElement(QrBusinessCard, {
      employee: sampleEmployee,
      url: "https://ecard.qtm.vn/card/nguyen-van-an",
    }),
  );
  const viCardSvg = renderWithLocale(
    "vi",
    createElement(QrBusinessCard, {
      employee: sampleEmployee,
      url: "https://ecard.qtm.vn/card/nguyen-van-an",
    }),
  );

  // Static labels translate according to locale
  assert.ok(enCardSvg.includes("Office"), "English card SVG should display 'Office'");
  assert.ok(enCardSvg.includes("Mobile"), "English card SVG should display 'Mobile'");
  assert.ok(viCardSvg.includes("Văn phòng"), "Vietnamese card SVG should display 'Văn phòng'");
  assert.ok(viCardSvg.includes("Di động"), "Vietnamese card SVG should display 'Di động'");

  assert.ok(enCardSvg.includes("Head of Partnership &amp; Development"));
  assert.ok(enCardSvg.includes("QTM MEDIA TECHNOLOGY JOINT STOCK COMPANY"));
  assert.ok(viCardSvg.includes("Trưởng ban Hợp tác Phát triển"));
  assert.ok(viCardSvg.includes(sampleEmployee.company));

  // Custom fields remain verbatim; localization does not change stored data.
  for (const rendered of [enCardSvg, viCardSvg]) {
    assert.ok(rendered.includes("22 Ho Giam, Dong Da, Hanoi"));
    assert.ok(rendered.includes("an.nguyen@qtmmedia.vn"));
    assert.ok(rendered.includes("qtmmedia.vn"));
  }

  // Directory card list item + contact list + profile info
  const cyberEmployee: Employee = {
    ...sampleEmployee,
    theme: { ...sampleEmployee.theme, businessCardType: "an-ninh-mang" },
  };
  const enListHtml = renderWithLocale(
    "en",
    createElement(CardListContent, { employee: cyberEmployee }),
  );
  const viListHtml = renderWithLocale(
    "vi",
    createElement(CardListContent, { employee: cyberEmployee }),
  );
  assert.ok(enListHtml.includes("VIETNAM CYBER SECURITY MAGAZINE"));
  assert.ok(enListHtml.includes("View profile"));
  assert.ok(viListHtml.includes("TẠP CHÍ ĐIỆN TỬ AN NINH MẠNG VIỆT NAM"));
  assert.ok(viListHtml.includes("Xem hồ sơ"));

  const enContactsHtml = renderWithLocale(
    "en",
    createElement(ContactList, { employee: sampleEmployee }),
  );
  const viContactsHtml = renderWithLocale(
    "vi",
    createElement(ContactList, { employee: sampleEmployee }),
  );
  assert.ok(enContactsHtml.includes("Head Office:"));
  assert.ok(enContactsHtml.includes("Phone:"));
  assert.ok(viContactsHtml.includes("Trụ sở:"));
  assert.ok(viContactsHtml.includes("Điện thoại:"));

  const emptyEmployee: Employee = {
    ...sampleEmployee,
    fullName: "",
    position: "",
    company: "",
  };
  const enProfilePlaceholder = renderWithLocale(
    "en",
    createElement(ProfileInfo, { employee: emptyEmployee }),
  );
  const viProfilePlaceholder = renderWithLocale(
    "vi",
    createElement(ProfileInfo, { employee: emptyEmployee }),
  );
  assert.ok(enProfilePlaceholder.includes("EMPLOYEE FULL NAME"));
  assert.ok(viProfilePlaceholder.includes("HỌ TÊN NHÂN VIÊN"));
  assert.deepEqual(localizeEmployee(sampleEmployee), sampleEmployee);
});

test("QTM QR card keeps the company on one line and localizes both office rows", () => {
  const employee = {
    ...sampleEmployee,
    offices: [
      { label: "Head Office", address: "No.22 Ho Giam Street, Van Mieu - Quoc Tu Giam Ward, Hanoi, Vietnam" },
      { label: "Hanoi Office", address: "01 Le Duc Tho Street, Tu Liem Ward, Hanoi, Viet Nam" },
    ],
  };
  const original = structuredClone(employee);
  const vi = localizeEmployee(employee, "vi");
  assert.equal(vi.offices[1].address, "Số 01 Lê Đức Thọ, phường Từ Liêm, Hà Nội, Việt Nam");
  assert.deepEqual(localizeEmployee(vi, "en").offices, localizeEmployee(employee, "en").offices);

  for (const locale of ["vi", "en"] as const) {
    const svg = renderWithLocale(locale, createElement(QrBusinessCard, { employee, url: "https://example.com/card/test" }));
    const localized = localizeEmployee(employee, locale);
    const texts = [...svg.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(match => match[1]);
    assert.ok(texts.includes(localized.company.toUpperCase()), "Entire company must be in one SVG text element");
    assert.equal((svg.match(/d="M12 1.5a8/g) || []).length, 2, "Both offices must have a location pin");
    assert.ok(texts.includes(locale === "vi" ? "VPHN" : "Hanoi Office"));
    const content = texts.join(" ");
    assert.ok(content.includes(localized.offices[0].address));
    assert.ok(content.includes(localized.offices[1].address));
    assert.ok(!content.includes(locale === "vi" ? "Street" : "phường"));
  }
  assert.deepEqual(employee, original);
});

test("error mapper translates server error messages and status codes into English and Vietnamese", () => {
  const tEn = (key: string) => lookupMessage(enMessages as unknown as Record<string, unknown>, key);
  const tVi = (key: string) => lookupMessage(viMessages as unknown as Record<string, unknown>, key);

  const authErr = new Error("Email hoặc mật khẩu không chính xác.");
  assert.equal(translateErrorMessage(authErr, tEn), "Incorrect email or password.");
  assert.equal(translateErrorMessage(authErr, tVi), "Email hoặc mật khẩu không chính xác.");

  const rateLimitErr = { status: 429 };
  assert.equal(
    translateErrorMessage(rateLimitErr, tEn),
    "Too many sign-in attempts. Please try again in 15 minutes.",
  );
  assert.equal(
    translateErrorMessage(rateLimitErr, tVi),
    "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng quay lại sau 15 phút.",
  );

  // Number & date formatting helpers respect locale
  assert.equal(formatLocalizedNumber(1234567, "en"), "1,234,567");
  assert.equal(formatLocalizedNumber(1234567, "vi"), "1.234.567");
  assert.ok(formatLocalizedDate("2026-10-25T00:00:00.000Z", "en").length > 0);
  assert.ok(formatLocalizedDate("2026-10-25T00:00:00.000Z", "vi").length > 0);
});

test("employee names keep their source spelling in Vietnamese and omit accents in English", () => {
  for (const [source, english] of [
    ["NGUYỄN TẤT HỒNG DƯƠNG", "NGUYEN TAT HONG DUONG"],
    ["ĐẶNG ĐỖ ÁNH HƯỜNG", "DANG DO ANH HUONG"],
    ["Nguyễn Đặng bảo Toàn", "Nguyen Dang bao Toan"],
    ["TRAN THE ANH", "TRAN THE ANH"],
    ["", ""],
    ["NGUYỄN ĐỨC".normalize("NFD"), "NGUYEN DUC"],
  ]) {
    assert.equal(localizeEmployeeName(source, "vi"), source);
    assert.equal(localizeEmployeeName(source, "en"), english);
  }
  const originalName = sampleEmployee.fullName;
  assert.equal(localizeEmployee(sampleEmployee, "en").fullName, "NGUYEN VAN AN");
  assert.equal(localizeEmployee(sampleEmployee, "vi").fullName, originalName);
  assert.equal(localizeEmployee(sampleEmployee).fullName, originalName);
  assert.equal(sampleEmployee.fullName, originalName);
});

test("public directory and both exported card styles show names in the selected language", () => {
  for (const businessCardType of ["qtm", "an-ninh-mang"] as const) {
    const employee = { ...sampleEmployee, fullName: "NGUYỄN TẤT HỒNG DƯƠNG", theme: { ...sampleEmployee.theme, businessCardType } };
    for (const locale of ["vi", "en"] as const) {
      const expected = locale === "vi" ? employee.fullName : "NGUYEN TAT HONG DUONG";
      const directory = renderWithLocale(locale, createElement(CardListContent, { employee }));
      const exportedCard = renderWithLocale(locale, createElement(QrBusinessCard, { employee, url: "https://example.com/card/test" }));
      assert.ok(directory.includes(expected));
      assert.ok(exportedCard.includes(expected));
      if (locale === "en") {
        assert.ok(!directory.includes(employee.fullName));
        assert.ok(!exportedCard.includes(employee.fullName));
      }
    }
    assert.equal(employee.fullName, "NGUYỄN TẤT HỒNG DƯƠNG");
  }
});

test("admin employee tables and mobile cards localize displayed names while preserving their source", () => {
  const employee = { ...sampleEmployee, fullName: "TRẦN DUY NAM ANH" };
  for (const locale of ["en", "vi"] as const) {
    const expected = locale === "en" ? "TRAN DUY NAM ANH" : employee.fullName;
    for (const element of [
      createElement(EmployeeTable, { employees: [employee] }),
      createElement(TeamTable, { employees: [employee] }),
      createElement(TeamRowCard, { employee, onToggleActive() {}, onDeleteRequest() {} }),
    ]) {
      const client = new QueryClient();
      try {
        const html = renderWithLocale(locale, createElement(QueryClientProvider, { client }, element));
        assert.ok(html.includes(expected));
        if (locale === "en") assert.ok(!html.includes(employee.fullName));
      } finally { client.clear(); }
    }
  }
  assert.equal(employee.fullName, "TRẦN DUY NAM ANH");
});

test("employee pagination renders numbered pages, the current page and localized range", () => {
  for (const locale of ["en", "vi"] as const) {
    const html = renderWithLocale(locale, createElement(EmployeePagination, { page: 2, pageSize: 10, total: 23, onPageChange() {} }));
    assert.ok(html.includes('aria-current="page"'));
    assert.ok(html.includes(locale === "vi" ? "Trang 3" : "Page 3"));
    assert.ok(html.includes("11–20"));
    assert.ok(html.includes("23"));
  }
  const empty = renderWithLocale("en", createElement(EmployeePagination, { page: 1, pageSize: 10, total: 0, onPageChange() {} }));
  assert.ok(empty.includes("0–0"));
  assert.ok(!empty.includes("<nav"));
});

test("Save contact uses a real native VCF link in the current language; unsaved previews use the local fallback", () => {
  for (const locale of ["vi", "en"] as const) {
    const href = `/api/cards/${sampleEmployee.slug}/contact.vcf?lang=${locale}`;
    assert.equal(contactDownloadUrl(sampleEmployee, locale), href);
    for (const element of [createElement(CardActions, { employee: sampleEmployee }), createElement(ActionGrid, { employee: sampleEmployee })]) {
      const html = renderWithLocale(locale, element);
      assert.ok(html.includes(`href="${href}"`));
    }
  }
  assert.equal(contactDownloadUrl({ ...sampleEmployee, id: "preview" }, "vi"), "");
});
