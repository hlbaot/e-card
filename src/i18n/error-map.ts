export type ErrorTranslationKey =
  | `errors.${string}`
  | `validation.${string}`
  | `toast.${string}`
  | `admin.${string}`;

const MESSAGE_TO_KEY_MAP: Array<{ pattern: RegExp; key: ErrorTranslationKey }> = [
  // Auth & session
  { pattern: /email hoặc mật khẩu không chính xác|incorrect email or password/i, key: "errors.invalidCredentials" },
  { pattern: /email hoặc mật khẩu không hợp lệ|invalid email or password/i, key: "errors.invalidLoginInput" },
  { pattern: /đăng nhập không thành công|sign in failed/i, key: "errors.loginFailed" },
  { pattern: /phiên (đăng nhập|làm việc) đã hết hạn|session has expired/i, key: "errors.unauthorized" },
  { pattern: /không thể xác thực|unable to verify account/i, key: "errors.authCheckFailed" },
  { pattern: /không có quyền thực hiện|do not have permission/i, key: "errors.forbidden" },
  { pattern: /thử đăng nhập quá nhiều lần|too many sign-in attempts/i, key: "errors.tooManyAttempts" },
  { pattern: /mật khẩu hiện tại không chính xác|current password is incorrect/i, key: "errors.incorrectCurrentPassword" },
  { pattern: /vui lòng nhập mật khẩu hiện tại|please enter your current password/i, key: "validation.currentPasswordRequired" },
  { pattern: /mật khẩu mới.*(?:ít nhất|tối thiểu) 8 ký tự|at least 8 characters/i, key: "validation.newPasswordMinLength" },
  { pattern: /mật khẩu mới không được trùng|must be different from the current password/i, key: "validation.newPasswordSameAsCurrent" },
  { pattern: /mật khẩu xác nhận không khớp|password confirmation does not match/i, key: "validation.passwordConfirmationMismatch" },
  { pattern: /không thể đổi mật khẩu|unable to change password/i, key: "errors.changePasswordFailed" },

  // Employee & validation
  { pattern: /vui lòng nhập họ tên|please enter the employee's full name/i, key: "validation.requiredFullName" },
  { pattern: /website không hợp lệ|valid website url/i, key: "validation.invalidWebsite" },
  { pattern: /ảnh phải là url https|avatar must be an https url/i, key: "validation.invalidAvatarUrl" },
  { pattern: /nền không hợp lệ|selected background is invalid/i, key: "validation.invalidBackground" },
  { pattern: /mã màu không hợp lệ|color hex code is invalid/i, key: "validation.invalidColor" },
  { pattern: /không có dữ liệu cập nhật|no changes provided/i, key: "validation.emptyUpdatePayload" },
  { pattern: /không tìm thấy nhân viên|employee not found/i, key: "errors.employeeNotFound" },
  { pattern: /id nhân viên không hợp lệ|invalid employee id/i, key: "errors.invalidEmployeeId" },
  { pattern: /không thể tạo slug duy nhất|unique profile slug/i, key: "errors.duplicateSlug" },
  { pattern: /đang cập nhật trạng thái|updating status\. please wait/i, key: "errors.toggleStatusPending" },
  { pattern: /không thể tải dữ liệu nhân viên|unable to load employee data/i, key: "errors.loadEmployeesFailed" },

  // Avatar upload
  { pattern: /file ảnh đang trống|image file is empty/i, key: "validation.emptyAvatarFile" },
  { pattern: /ảnh tối đa 2 mb|not exceed 2 mb/i, key: "validation.avatarTooLarge" },
  { pattern: /chỉ nhận ảnh jpg, png hoặc webp|only valid jpg, png, or webp/i, key: "validation.invalidAvatarFormat" },
  { pattern: /chưa cấu hình dịch vụ lưu ảnh|image storage service is not configured/i, key: "errors.storageNotConfigured" },
  { pattern: /không thể kết nối dịch vụ ảnh|unable to connect to image service/i, key: "errors.storageConnectionFailed" },
  { pattern: /upload preset cloudinary không tồn tại|cloudinary upload preset not found/i, key: "errors.cloudinaryPresetMissing" },
  { pattern: /chưa bật chế độ unsigned|unsigned mode enabled/i, key: "errors.cloudinaryUnsignedDisabled" },
  { pattern: /vượt giới hạn dung lượng của cloudinary|exceeds cloudinary size limit/i, key: "errors.cloudinaryFileTooLarge" },
  { pattern: /không thể (tải ảnh lên|lưu ảnh)|unable to upload image/i, key: "errors.uploadAvatarFailed" },

  // Public cards & QR export
  { pattern: /không tìm thấy danh thiếp|business card not found/i, key: "errors.cardNotFound" },
  { pattern: /không thể tải (danh sách )?danh thiếp|unable to load business cards/i, key: "errors.loadCardsFailed" },
  { pattern: /mã qr chưa sẵn sàng|qr code is not ready/i, key: "errors.qrNotReady" },
  { pattern: /danh thiếp chưa sẵn sàng|business card preview is not ready/i, key: "errors.cardNotReady" },
  { pattern: /không thể (xuất png|tạo ảnh danh thiếp|tải logo danh thiếp|đọc logo danh thiếp)|unable to export business card png/i, key: "errors.exportPngFailed" },

  // Generic server / network
  { pattern: /hệ thống đang bận|system is busy/i, key: "errors.serviceBusy" },
  { pattern: /đã có lỗi xảy ra|something went wrong/i, key: "errors.generic" },
];

const CODE_TO_KEY_MAP: Record<string, ErrorTranslationKey> = {
  UNAUTHORIZED: "errors.unauthorized",
  FORBIDDEN: "errors.forbidden",
  INVALID_CREDENTIALS: "errors.invalidCredentials",
  TOO_MANY_ATTEMPTS: "errors.tooManyAttempts",
  EMPLOYEE_NOT_FOUND: "errors.employeeNotFound",
  CARD_NOT_FOUND: "errors.cardNotFound",
  AVATAR_TOO_LARGE: "validation.avatarTooLarge",
  INVALID_AVATAR_FORMAT: "validation.invalidAvatarFormat",
  UPLOAD_FAILED: "errors.uploadAvatarFailed",
  SERVICE_BUSY: "errors.serviceBusy",
};

export function resolveErrorTranslationKey(
  error: unknown,
  fallbackKey: ErrorTranslationKey = "errors.generic",
): ErrorTranslationKey {
  if (error && typeof error === "object") {
    const maybeCode = (error as { code?: unknown }).code;
    if (typeof maybeCode === "string" && CODE_TO_KEY_MAP[maybeCode]) {
      return CODE_TO_KEY_MAP[maybeCode];
    }
  }

  const rawMessage =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "";

  for (const { pattern, key } of MESSAGE_TO_KEY_MAP) {
    if (pattern.test(rawMessage)) {
      return key;
    }
  }

  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: number }).status;
    if (status === 401) return "errors.unauthorized";
    if (status === 403) return "errors.forbidden";
    if (status === 404) return "errors.employeeNotFound";
    if (status === 429) return "errors.tooManyAttempts";
    if (status === 503) return "errors.serviceBusy";
  }

  return fallbackKey;
}

/**
 * Translate any error object/message using the root translation function `t`
 * (or namespace-free translator that accepts `errors.*` and `validation.*`).
 */
export function translateErrorMessage(
  error: unknown,
  t: (key: string, values?: Record<string, string | number>) => string,
  fallbackKey: ErrorTranslationKey = "errors.generic",
): string {
  const key = resolveErrorTranslationKey(error, fallbackKey);
  return t(key);
}
