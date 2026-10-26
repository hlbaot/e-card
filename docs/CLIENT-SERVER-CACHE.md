# Cache client và server

## Đã triển khai

- QueryClient tạo bằng `useState` trong provider gắn ở root layout, không có QueryClient singleton ở module scope. Mặc định: `staleTime=60_000`, `gcTime=600_000`, `refetchOnWindowFocus=false`, `retry=1`.
- Employees, cards quản trị và dashboard dùng chung query danh sách nhân viên vì cần cùng dữ liệu, kể cả card đang tắt. Không tạo bản sao danh sách trong namespace cards hay Zustand.
- Hook chi tiết dùng cache list làm dữ liệu ban đầu khi có; hook list có `keepPreviousData` và kiểm tra scope tài khoản. Tìm kiếm hiện vẫn lọc phía client như trước, không tự thêm API phân trang/lọc.
- CRUD, toggle và upload dùng mutation; response thành công cập nhật list/detail tức thì rồi invalidate employees/stats/cards. Các write đang chạy cùng lúc được chờ trước khi refetch xác nhận, để không ghi đè optimistic update khác. Toggle cập nhật lạc quan list/detail/stats, rollback khi lỗi; khóa thao tác toggle trùng một ID khi đang chờ.
- Sidebar prefetch list cho employees/cards và list + stats cho dashboard khi hover/focus/touch.
- Zustand chỉ giữ hai chuỗi tìm kiếm UI. QueryClient và chuỗi tìm kiếm được xóa khi logout, hết phiên hoặc đổi tài khoản. Response cũ đến sau khi đổi tài khoản không được ghi lại vào cache. Không lưu server-state vào localStorage.
- API GET list/detail/stats tính ETag từ JSON; so sánh cả weak/strong validator, danh sách tag và `*`; 304 không body. API admin xác thực trước khi so ETag, trả `private, max-age=0, must-revalidate` và `Vary: Cookie`. Auth, mutation và lỗi giữ `no-store`.
- API cards public cũng có ETag, dùng `public, max-age=0, must-revalidate`. Chủ động không bật CDN `s-maxage`/SWR vì bản sao CDN độc lập có thể tiếp tục trả card đã ẩn/xóa sau khi tag Next bị vô hiệu hóa.
- Adapter Axios chuyển tiếp AbortSignal và header response. GET dữ liệu dùng HTTP cache trình duyệt với `cache: no-cache` (luôn xác nhận lại); endpoint auth và mọi request ghi vẫn `no-store`. Trình duyệt tự gửi validator và ghép body đã lưu khi server trả 304, không phải JavaScript lưu thêm một bản server-state.
- Card public vẫn là Server Component. Home/card đọc Next Data Cache 60 giây, tag `public-cards`; mọi tạo/sửa/xóa/toggle thành công gọi `revalidateTag(tag, { expire: 0 })`. Chọn API `unstable_cache` theo phạm vi yêu cầu hiện tại, chưa bật Cache Components hoặc đổi convention toàn dự án.
- Card theo slug kiểm tra visibility bằng query chỉ lấy ID ngoài persistent cache. Card bị ẩn/xóa trả 404 thay vì dùng body cũ trong Data Cache. React `cache()` gộp đọc metadata/page trong cùng request.
- Prisma dùng projection rõ các field DTO/visibility, bỏ FK theme không dùng; lấy theme cùng batch quan hệ, không query riêng cho từng nhân viên. Stats vẫn là một truy vấn groupBy. Index UUID/slug hiện có được giữ, migration mở rộng index public theo sort và thêm index admin theo `deletedAt, createdAt DESC, id`.

## Query key

| Mục đích | Key |
| --- | --- |
| Invalidate toàn bộ employee | `["employees"]` |
| List admin | `["employees", userId, "list"]` |
| Chi tiết admin | `["employees", userId, "detail", id]` |
| Invalidate stats | `["stats"]` |
| Stats admin | `["stats", userId]` |
| Namespace card public | `["cards"]`, `["cards", "list"]`, `["cards", "detail", slug]` |
| Mutation | `["employee-write", userId]`, toggle thêm `"toggle"` |

Các key card public được định nghĩa tập trung để invalidate các consumer public; trang cards quản trị dùng key employees, không gọi API public vốn chỉ trả card active. Trang card Server Component dùng tag Next, không đưa dữ liệu đó vào React Query.

## Kiểm tra bằng Network và Devtools

1. Chạy ứng dụng theo cấu hình hiện có bằng `pnpm dev`, đăng nhập admin. Mở DevTools → Network, **bỏ chọn Disable cache**, bật Preserve log nếu cần, lọc `/api/admin/employees` và `/api/admin/stats`.
2. Mở employees lần đầu: GET 200 có ETag. Chuyển cards rồi quay lại employees trong 60 giây: dữ liệu hiện từ cache, không có GET employees mới. Mở dashboard lần đầu cần stats; hover sidebar có thể đã prefetch trước lúc bấm. Sau khi đã tải, quay lại dashboard trong 60 giây không cần GET stats/list mới. Request auth hoặc RSC của Next không phải request dữ liệu này.
3. Rời trang, chờ hơn 60 giây rồi quay lại: thấy dữ liệu cũ ngay và request chạy ngầm. Nếu dữ liệu DB không đổi, Network có thể hiển thị 304, request có `If-None-Match`; fetch/Axios vẫn nhận body đã được browser ghép từ HTTP cache. Không nhầm 304 với việc React Query không gửi request. Hết staleTime chỉ làm query cũ; không có polling tự động khi ngồi yên trên trang.
4. Nếu browser/dev mode không tự gửi validator, kiểm tra xác định bằng Console cùng origin, không cần sao chép cookie:

```js
const first = await fetch('/api/admin/employees', { cache: 'no-store' });
const etag = first.headers.get('ETag');
const unchanged = await fetch('/api/admin/employees', {
  cache: 'no-store', headers: { 'If-None-Match': etag },
});
console.log(unchanged.status, await unchanged.text()); // 304, chuỗi rỗng
```

5. Tạo/sửa/xóa/toggle: list và detail thay đổi khi response ghi thành công, stats đọc lại; GET sau thay đổi có ETag mới nếu JSON đổi. Toggle phải thay đổi ngay khi đang chờ; mô phỏng lỗi riêng request PATCH (ví dụ chặn request trong môi trường thử) thì trạng thái được hoàn tác. Tải lại ngầm, kể cả lỗi GET tạm thời, không xóa danh sách cũ.
6. Bật React Query Devtools bằng nút nổi ở góc trang trong dev. Xem key có userId, Fresh trong 60 giây và Inactive khi rời trang; quay lại còn cache trước 10 phút. Có thể dùng nút invalidate/refetch trong Devtools để quan sát background fetching. Devtools không hiện ở production.
7. Logout rồi đăng nhập tài khoản khác: danh sách query cũ phải rỗng, không hiện dữ liệu admin trước. Query/mutation đến muộn cũng không được nạp lại dữ liệu của phiên cũ.
8. Mở card public, sửa nội dung từ admin rồi truy cập lại card: nội dung mới được đọc sau invalidate tag. Tắt active hoặc xóa rồi truy cập lại: 404. Với Data Cache của Next, nên kiểm tra thêm trên môi trường production local sau `pnpm build && pnpm start` do dev/HMR có hành vi cache khác.

## Kết quả đã chạy và giới hạn

- `pnpm tsc --noEmit`: exit 0.
- `pnpm lint`: exit 0, 0 lỗi; 1 warning có sẵn `_employee` tại `src/shared/types/employee.ts:43`, giữ nguyên ngoài phạm vi.
- `pnpm test`: smoke PASS và 26 test đạt (auth 12, cards 3, admin 5, cache client 5, HTTP cache 1), không fail/skip.
- `git diff --check`: đạt.
- Test mới kiểm tra TTL/deduplication và dữ liệu cũ khi fetch, optimistic rollback không ghi đè nhân viên khác, clear/late response khi đổi tài khoản, callbacks mutation dùng bởi hook, ETag/304 và auth trước conditional response, visibility trước persistent cache, invalidation sau ghi thành công.
- Chưa thực hiện đăng nhập/browser Network thực tế hoặc test DB thật; các bước trên là hướng dẫn xác nhận thủ công. Test route dùng repository bộ nhớ và spy invalidation, không xác nhận hạ tầng tag cache trong production thực tế. Chưa chạy build trong yêu cầu này.
- Chưa áp dụng migration vào DB. Khi triển khai theo quy trình hiện có, áp dụng bằng `pnpm db:migrate`; cân nhắc thời gian khóa index nếu bảng lớn. Không chạy migration/seed hoặc sửa dữ liệu DB trong lần làm này.
- ETag giảm payload, không tự loại bỏ truy vấn DB khi request tới API admin. TTL/tag của Next giảm đọc nội dung public; visibility vẫn đọc DB. Cache React Query chỉ trong tab: reload cứng/mở tab mới cần nạp lại; chỉnh sửa từ admin khác được thấy sau staleTime và lần refetch tiếp theo, chưa bổ sung realtime.

## File tạo mới

- `src/client/providers/QueryProvider.tsx`
- `src/client/queries/keys.ts`
- `src/client/queries/client.ts`
- `src/client/queries/employees.ts`
- `src/client/queries/employee-cache.ts`
- `src/client/queries/employee-mutations.ts`
- `src/client/hooks/useEmployee.ts`
- `src/client/hooks/useEmployeeMutations.ts`
- `src/server/http-cache.ts`
- `src/server/cards/cache.ts`
- `src/server/cards/select.ts`
- `prisma/migrations/20261026090000_employee_cache_query_indexes/migration.sql`
- `tests/cache-client.test.tsx`
- `tests/http-cache.test.ts`
- `docs/CLIENT-SERVER-CACHE.md`

## File sửa trong yêu cầu cache này

- `package.json`
- `pnpm-lock.yaml`
- `prisma/schema.prisma`
- `src/app/layout.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/card/[slug]/page.tsx`
- `src/api/client.ts`
- `src/api/employee.api.ts`
- `src/client/hooks/useEmployees.ts`
- `src/client/hooks/useEmployeeStats.ts`
- `src/client/store/employee.store.ts`
- `src/client/components/layout/AdminSidebar.tsx`
- `src/client/components/admin/EmployeeForm.tsx`
- `src/client/components/admin/EmployeeTable.tsx`
- `src/client/components/admin/dashboard/TeamTable.tsx`
- `src/client/components/admin/dashboard/TeamRowCard.tsx`
- `src/client/components/ui/Switch.tsx`
- `src/views/AdminEmployeesView.tsx`
- `src/views/AdminCardsView.tsx`
- `src/views/AdminDashboardView.tsx`
- `src/views/AdminEmployeeEditView.tsx`
- `src/server/admin/controller.ts`
- `src/server/admin/repository.ts`
- `src/server/cards/controller.ts`
- `src/server/cards/repository.ts`
- `src/server/cards/service.ts`
- `tests/admin-client.test.ts`
- `tests/admin.test.ts`
- `tests/cards.test.ts`
- `docs/admin-api.md`
- `docs/cards.md`
