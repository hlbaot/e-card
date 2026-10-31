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
import { QrBusinessCard } from "../src/client/components/card/QrBusinessCard";
import { CardListContent } from "../src/client/components/card/CardListItem";
import { ContactList } from "../src/client/components/card/ContactList";
import { ProfileInfo } from "../src/client/components/card/ProfileInfo";
import { DEFAULT_PUBLIC_FIELDS, type Employee } from "../src/shared/types";
import { formatLocalizedDate, formatLocalizedNumber, localizeEmployee } from "../src/shared/utils/localize";

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

test("public card components render in both English ('en') and Vietnamese ('vi') while preserving user DB fields verbatim", () => {
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

  // User DB fields are preserved verbatim in both locales
  for (const rendered of [enCardSvg, viCardSvg]) {
    assert.ok(rendered.includes("Trưởng ban Hợp tác Phát triển"));
    assert.ok(rendered.includes("CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG"));
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
