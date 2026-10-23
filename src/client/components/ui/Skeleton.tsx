export function Skeleton() {
  return (
    <div className="skeleton" role="status" aria-label="Đang tải dữ liệu">
      <div />
      <div />
      <div />
      <span className="sr-only">Đang tải dữ liệu…</span>
    </div>
  );
}
