export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function uniqueSlug(name: string, existing: string[]) {
  const base = slugify(name) || "nhan-vien";
  let slug = base;
  while (existing.includes(slug))
    slug = `${base}-${crypto.randomUUID().replace(/-/g, "").slice(0, 4)}`;
  return slug;
}
