import type { TemplateOption, DecorKey } from "@/shared/types";
export const templates: TemplateOption[] = [
{ id: "bubble-blue", name: "Bubble Blue", shapes: [{id:"accent-bar",label:"Thanh nhấn góc"}], defaultBackgroundId:"sky-soft",defaultColor:"#0F4C75" },
{ id:"minimal-line",name:"Minimal Line",shapes:[{id:"top-line",label:"Nét mảnh ở góc"}],defaultBackgroundId:"white-clean",defaultColor:"#1F2937" },
{ id:"dark-tech",name:"Dark Tech",shapes:[{id:"corner-glow",label:"Ánh sáng góc"}],defaultBackgroundId:"sky-soft",defaultColor:"#38BDF8" }];
export const backgrounds = [
{id:"sky-soft",name:"Xanh trời nhạt",css:"linear-gradient(180deg,#F4FAFF 0%,#E3F1FC 100%)"},
{id:"white-clean",name:"Trắng sạch",css:"#FFFFFF"},
{id:"mint-fresh",name:"Bạc hà",css:"linear-gradient(180deg,#F2FBF8 0%,#DDF3EC 100%)"},
{id:"sand-warm",name:"Cát ấm",css:"linear-gradient(180deg,#FFFBF3 0%,#F8EBD4 100%)"}];
export const decorOptions: { id: DecorKey | "none"; name: string }[] = [
  { id: "none", name: "Không" },
  { id: "blobs", name: "Blob mềm" },
  { id: "bokeh", name: "Chấm sáng nhẹ" },
  { id: "circles", name: "Vòng tròn mảnh" },
  { id: "leaves", name: "Cành lá" },
  { id: "geometry", name: "Hình học nhẹ" },
  { id: "network", name: "Kết nối số nhẹ" },
];
export const colorPresets = ["#0F4C75","#0284C7","#38BDF8","#0891B2","#10B981","#6EE7B7","#D4AF6A","#64748B"];
