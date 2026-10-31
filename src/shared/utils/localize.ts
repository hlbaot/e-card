import { migrateCardTheme } from "./migrate-theme";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { defaultLocale, getIntlLocale, resolveLocale, type Locale } from "@/i18n/config";

interface BilingualEntry {
  en: string;
  vi: string;
  aliases?: string[];
}

const BILINGUAL_DICTIONARY: readonly BilingualEntry[] = [
  // Positions / Job Titles
  {
    en: "Project Development Director",
    vi: "Giám đốc Phát triển Dự án",
    aliases: ["Giám đốc phát triển dự án"],
  },
  {
    en: "Account Executive",
    vi: "Chuyên viên Kinh doanh",
    aliases: ["Chuyên viên kinh doanh", "Chuyên viên Quản lý Khách hàng"],
  },
  {
    en: "Account Manager",
    vi: "Quản lý Khách hàng",
    aliases: ["Quản lý khách hàng"],
  },
  {
    en: "Creative Director",
    vi: "Giám đốc Sáng tạo",
    aliases: ["Giám đốc sáng tạo"],
  },
  {
    en: "AI Solutions Engineer",
    vi: "Kỹ sư Giải pháp Trí tuệ Nhân tạo",
    aliases: ["Kỹ sư giải pháp trí tuệ nhân tạo", "Kỹ sư AI"],
  },
  {
    en: "Event Producer",
    vi: "Nhà Sản xuất Sự kiện",
    aliases: ["Nhà sản xuất sự kiện"],
  },
  {
    en: "Editor-in-Chief",
    vi: "Tổng Biên Tập",
    aliases: ["Tổng Biên tập", "Tổng biên tập", "EDITOR-IN-CHIEF"],
  },
  {
    en: "Deputy Editor-in-Chief",
    vi: "Phó Tổng Biên Tập",
    aliases: ["Phó Tổng Biên tập", "Phó tổng biên tập", "DEPUTY EDITOR-IN-CHIEF"],
  },
  {
    en: "Managing Editor",
    vi: "Thư ký Tòa soạn",
    aliases: ["Thư ký tòa soạn", "Tổng Thư ký Tòa soạn"],
  },
  {
    en: "CEO",
    vi: "Tổng Giám đốc",
    aliases: [
      "Chief Executive Officer",
      "Tổng giám đốc",
      "Tổng Giám Đốc",
      "Giám đốc điều hành",
      "Giám đốc Điều hành",
    ],
  },
  {
    en: "Deputy CEO",
    vi: "Phó Tổng Giám đốc",
    aliases: ["Deputy General Director", "Phó tổng giám đốc", "Phó Tổng Giám Đốc"],
  },
  {
    en: "CTO",
    vi: "Giám đốc Công nghệ",
    aliases: ["Chief Technology Officer", "Giám đốc công nghệ", "Giám đốc Kỹ thuật"],
  },
  {
    en: "CFO",
    vi: "Giám đốc Tài chính",
    aliases: ["Chief Financial Officer", "Giám đốc tài chính"],
  },
  {
    en: "CMO",
    vi: "Giám đốc Marketing",
    aliases: ["Chief Marketing Officer"],
  },
  {
    en: "COO",
    vi: "Giám đốc Vận hành",
    aliases: ["Chief Operating Officer", "Giám đốc vận hành"],
  },
  {
    en: "Chairman of the Board",
    vi: "Chủ tịch Hội đồng Quản trị",
    aliases: ["Chairman", "Chủ tịch HĐQT", "Chủ tịch"],
  },
  {
    en: "Vice Chairman",
    vi: "Phó Chủ tịch",
    aliases: ["Phó Chủ tịch HĐQT"],
  },
  {
    en: "Director",
    vi: "Giám đốc",
    aliases: ["Giám Đốc"],
  },
  {
    en: "Deputy Director",
    vi: "Phó Giám đốc",
    aliases: ["Phó giám đốc", "Phó Giám Đốc"],
  },
  {
    en: "Head of Partnership & Development",
    vi: "Trưởng ban Hợp tác Phát triển",
    aliases: ["Trưởng ban hợp tác phát triển", "Head of Partnership and Development"],
  },
  {
    en: "Deputy Head of Partnership & Development",
    vi: "Phó ban Hợp tác Phát triển",
    aliases: ["Phó trưởng ban Hợp tác Phát triển"],
  },
  {
    en: "Head of Editorial Department",
    vi: "Trưởng ban Biên tập",
    aliases: ["Trưởng ban biên tập"],
  },
  {
    en: "Head of Communications",
    vi: "Trưởng ban Truyền thông",
    aliases: ["Trưởng phòng Truyền thông"],
  },
  {
    en: "Head of Representative Office",
    vi: "Trưởng Văn phòng Đại diện",
    aliases: ["Trưởng văn phòng đại diện", "Trưởng VPĐD"],
  },
  {
    en: "Project Manager",
    vi: "Quản lý Dự án",
    aliases: ["Quản lý dự án", "Trưởng dự án"],
  },
  {
    en: "Product Manager",
    vi: "Quản lý Sản phẩm",
    aliases: ["Quản lý sản phẩm"],
  },
  {
    en: "Marketing Manager",
    vi: "Trưởng phòng Marketing",
  },
  {
    en: "Sales Manager",
    vi: "Trưởng phòng Kinh doanh",
    aliases: ["Trưởng phòng kinh doanh"],
  },
  {
    en: "HR Manager",
    vi: "Trưởng phòng Nhân sự",
    aliases: ["Trưởng phòng nhân sự", "Human Resources Manager"],
  },
  {
    en: "Chief Accountant",
    vi: "Kế toán trưởng",
    aliases: ["Kế toán Trưởng"],
  },
  {
    en: "Accountant",
    vi: "Kế toán viên",
    aliases: ["Kế toán"],
  },
  {
    en: "Journalist",
    vi: "Nhà báo",
  },
  {
    en: "Reporter",
    vi: "Phóng viên",
  },
  {
    en: "Editor",
    vi: "Biên tập viên",
  },
  {
    en: "Software Developer",
    vi: "Lập trình viên",
    aliases: ["Developer", "DEV", "Dev", "Software Engineer", "Kỹ sư phần mềm"],
  },
  {
    en: "Graphic Designer",
    vi: "Thiết kế Đồ họa",
    aliases: ["Thiết kế đồ họa", "Designer", "UI/UX Designer"],
  },
  {
    en: "Marketing Executive",
    vi: "Chuyên viên Marketing",
    aliases: ["Marketing Specialist"],
  },
  {
    en: "Communications Specialist",
    vi: "Chuyên viên Truyền thông",
    aliases: ["Media Specialist"],
  },
  {
    en: "Cyber Security Specialist",
    vi: "Chuyên gia An ninh mạng",
    aliases: ["Chuyên viên An ninh mạng", "Security Specialist"],
  },
  {
    en: "IT Specialist",
    vi: "Chuyên viên CNTT",
    aliases: ["IT Support", "Kỹ thuật viên"],
  },
  {
    en: "Intern",
    vi: "Thực tập sinh",
  },

  // Companies, taglines & slogans
  {
    en: "QTM MEDIA TECHNOLOGY JOINT STOCK COMPANY",
    vi: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM",
  },
  {
    en: "VIETNAM CYBER SECURITY MAGAZINE",
    vi: "TẠP CHÍ ĐIỆN TỬ AN NINH MẠNG VIỆT NAM",
  },
  {
    en: "Vietnam Cyber Security Magazine",
    vi: "Tạp chí điện tử An ninh mạng Việt Nam",
  },
  {
    en: "Creating Value Through Technology and People",
    vi: "Kiến tạo giá trị bằng công nghệ và con người",
  },
  {
    en: "Let's Create a Brighter Tomorrow Together",
    vi: "Cùng nhau kiến tạo một tương lai tươi sáng",
  },

  // Office labels & addresses
  {
    en: "Head Office",
    vi: "Trụ sở chính",
    aliases: ["Trụ sở", "Headquarters"],
  },
  {
    en: "Hanoi Office",
    vi: "Văn phòng Hà Nội",
  },
  {
    en: "Ho Chi Minh Office",
    vi: "Văn phòng TP.HCM",
    aliases: ["HCMC Office", "Văn phòng TP. Hồ Chí Minh"],
  },
  {
    en: "Representative Office",
    vi: "Văn phòng đại diện",
  },
  {
    en: "Editorial Office",
    vi: "Tòa soạn",
  },
  {
    en: "Office",
    vi: "Văn phòng",
  },
  {
    en: "No. 22 Ho Giam Street, Van Mieu - Quoc Tu Giam Ward, Ha Noi, Viet Nam",
    vi: "Số 22 Hồ Giám, phường Văn Miếu - Quốc Tử Giám, Hà Nội, Việt Nam",
    aliases: [
      "No.22 Ho Giam Street, Van Mieu - Quoc Tu Giam Ward, Ha Noi, Viet Nam",
      "No. 22 Ho Giam Street, Van Mieu - Quoc Tu Giam Ward, Hanoi, Vietnam",
      "No.22 Ho Giam Street, Van Mieu - Quoc Tu Giam Ward, Hanoi, Vietnam",
      "22 Ho Giam, Van Mieu - Quoc Tu Giam Ward, Ha Noi, Viet Nam",
      "Số 22 phố Hồ Giám, phường Văn Miếu - Quốc Tử Giám, Hà Nội, Việt Nam",
    ],
  },
  {
    en: "No. 01 Le Duc Tho, Tu Liem Ward, Ha Noi, Viet Nam",
    vi: "Số 01 Lê Đức Thọ, phường Từ Liêm, Hà Nội, Việt Nam",
    aliases: [
      "No.01 Le Duc Tho, Tu Liem Ward, Ha Noi, Viet Nam",
      "No. 01 Le Duc Tho, Tu Liem Ward, Hanoi, Vietnam",
      "No.01 Le Duc Tho, Tu Liem Ward, Hanoi, Vietnam",
      "01 Le Duc Tho, Tu Liem Ward, Ha Noi, Viet Nam",
    ],
  },
  {
    en: "38 Phan Dinh Phung, Ba Dinh, Ha Noi",
    vi: "38 Phan Đình Phùng, Ba Đình, Hà Nội",
    aliases: [
      "38 Phan Dinh Phung, Ba Dinh, Hanoi",
      "38 Phan Dinh Phung, Ba Dinh Ward, Ha Noi, Viet Nam",
      "Số 38 Phan Đình Phùng, Ba Đình, Hà Nội",
      "38 Phan Đình Phùng, phường Ba Đình, Hà Nội",
    ],
  },
  {
    en: "123 Dien Bien Phu",
    vi: "123 Điện Biên Phủ",
  },
];

function normalizeKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\bno\.\s*/g, "no. ")
    .replace(/\bsố\s*/g, "số ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .replace(/\.$/, "");
}

const LOOKUP_BY_LOWER = new Map<string, BilingualEntry>();
for (const entry of BILINGUAL_DICTIONARY) {
  LOOKUP_BY_LOWER.set(normalizeKey(entry.en), entry);
  LOOKUP_BY_LOWER.set(normalizeKey(entry.vi), entry);
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      LOOKUP_BY_LOWER.set(normalizeKey(alias), entry);
    }
  }
}

export function localizeText(value: string, locale: Locale = defaultLocale): string {
  if (!value) return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  const resolved = resolveLocale(locale);
  const matched = LOOKUP_BY_LOWER.get(normalizeKey(trimmed));
  if (!matched) return value;
  return resolved === "vi" ? matched.vi : matched.en;
}

export function localizeEmployee(e: Employee, locale?: Locale): Employee {
  const normalized: Employee = {
    ...e,
    theme: migrateCardTheme(e.theme),
    allowIndexing: e.allowIndexing ?? false,
    publicFields: getPublicFields(e),
    fullName: e.fullName,
    position: e.position,
    company: e.company,
    companyShort: e.companyShort,
    slogan: e.slogan,
    offices: e.offices.map((o) => ({
      label: o.label,
      address: o.address,
    })),
  };

  if (!locale) {
    return normalized;
  }

  return {
    ...normalized,
    position: localizeText(normalized.position, locale),
    company: localizeText(normalized.company, locale),
    companyShort: localizeText(normalized.companyShort, locale),
    slogan: localizeText(normalized.slogan, locale),
    offices: normalized.offices.map((o) => ({
      label: localizeText(o.label, locale),
      address: localizeText(o.address, locale),
    })),
  };
}

export function formatLocalizedNumber(
  value: number,
  locale: Locale = defaultLocale,
  options?: Intl.NumberFormatOptions,
): string {
  const intlLocale = getIntlLocale(resolveLocale(locale));
  return new Intl.NumberFormat(intlLocale, options).format(value);
}

export function formatLocalizedDate(
  value: Date | string | number,
  locale: Locale = defaultLocale,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale = getIntlLocale(resolveLocale(locale));
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}
