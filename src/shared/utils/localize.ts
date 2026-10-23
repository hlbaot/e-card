import { migrateCardTheme } from "./migrate-theme";
import { getPublicFields, type Employee } from "@/shared/types/employee";
const translations: Record<string, string> = {
  "TRAN DUY NAM ANH": "TRẦN DUY NAM ANH",
  "LE MINH CHAU": "LÊ MINH CHÂU",
  "PHAM THU HA": "PHẠM THU HÀ",
  "NGUYEN HOANG LONG": "NGUYỄN HOÀNG LONG",
  "VO THANH TAM": "VÕ THÀNH TÂM",
  "Project Development Director": "Giám đốc phát triển dự án",
  "Creative Director": "Giám đốc sáng tạo",
  "Account Manager": "Quản lý khách hàng",
  "AI Solutions Engineer": "Kỹ sư giải pháp trí tuệ nhân tạo",
  "Event Producer": "Nhà sản xuất sự kiện",
  "QTM MEDIA TECHNOLOGY JOINT STOCK COMPANY":
    "CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM",
  "Head Office": "Trụ sở chính",
  "Hanoi Office": "Văn phòng Hà Nội",
  "No.22 Ho Giam Street, Van Mieu - Quoc Tu Giam Ward, Ha Noi, Viet Nam":
    "Số 22 Hồ Giám, phường Văn Miếu - Quốc Tử Giám, Hà Nội, Việt Nam",
  "No.01 Le Duc Tho, Tu Liem Ward, Ha Noi, Viet Nam":
    "Số 01 Lê Đức Thọ, phường Từ Liêm, Hà Nội, Việt Nam",
  "Let's Create a Brighter Tomorrow Together":
    "Cùng nhau kiến tạo một tương lai tươi sáng",
};
export function localizeText(value: string) {
  return translations[value] || value;
}
// Translate only exact seed values. Preserve all custom names and content entered by the user.
export function localizeEmployee(e: Employee): Employee {
  return {
    ...e,
    theme: migrateCardTheme(e.theme),
    allowIndexing: e.allowIndexing ?? false,
    publicFields: getPublicFields(e),
    fullName: localizeText(e.fullName),
    position: localizeText(e.position),
    company: localizeText(e.company),
    slogan: localizeText(e.slogan),
    offices: e.offices.map((o) => ({
      label: localizeText(o.label),
      address: localizeText(o.address),
    })),
  };
}
