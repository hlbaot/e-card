import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { migrateCardTheme } from "../src/shared/utils/migrate-theme";
import { decorOptions } from "../src/config/theme-options";
import { themeInput } from "../src/server/admin/dto";
import { CyberMagazineArtwork, CyberMagazineExportDecor, cyberMagazineOpacity } from "../src/client/components/card/CyberMagazineArtwork";
import { ProfileDecorations } from "../src/client/components/card/ProfileDecorations";
import { DecorSwatch } from "../src/client/components/card/DecorIllustration";
import { CardDecorations } from "../src/client/components/card/CardDecorations";
import type { CardTheme } from "../src/shared/types";

const base: CardTheme = {
  templateId: "bubble-blue", backgroundId: "white-clean", primaryColor: "#0F4C75",
  avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft", shapes: {},
  decor: ["cyber-magazine"], decorOpacity: 35,
};
const html = (element: ReactElement) => renderToStaticMarkup(element);

test("selector preserves eight choices and replaces the fourth choice", () => {
  assert.equal(decorOptions.length, 8);
  assert.deepEqual(decorOptions[3], { id: "cyber-magazine", name: "themeCustomizer.patterns.cyberMagazine" });
});

test("legacy decor and pattern fields migrate idempotently; API accepts old and new keys", () => {
  for (const legacy of [{ decor: ["circles"] }, { decor: undefined, pattern: "circles" }, { decor: undefined, patternId: "circles" }]) {
    const theme = migrateCardTheme({ ...base, ...legacy });
    assert.deepEqual(theme.decor, ["cyber-magazine"]);
    assert.deepEqual(migrateCardTheme(theme), theme);
  }
  for (const key of ["circles", "cyber-magazine"]) {
    assert.deepEqual(themeInput.parse({ ...base, decor: [key] }).decor, ["cyber-magazine"]);
  }
  assert.equal(migrateCardTheme({ ...base, decorOpacity: undefined }).decorOpacity, 35);
});

test("thumbnail, profile and generic card share vector artwork; primary changes preserve gold", () => {
  for (const element of [
    <DecorSwatch key="swatch" decor="cyber-magazine" primaryColor="#10B981" />,
    <ProfileDecorations key="profile" theme={{ ...base, primaryColor: "#10B981" }} />,
    <CardDecorations key="generic" theme={{ ...base, primaryColor: "#10B981" }} />,
  ]) {
    const rendered = html(element);
    assert.ok(rendered.includes('data-decor="cyber-magazine"'));
    assert.ok(rendered.includes('#10B981'));
    assert.ok(rendered.includes('#C9A227'));
    assert.ok(!rendered.includes('<image'));
  }
  const original = html(<CyberMagazineArtwork />);
  for (const color of ["#0A1F44", "#0B2A5B", "#0F3A75", "#BFE3FF", "#C9A227", "#E6C766"]) assert.ok(original.includes(color));
  const together = renderToStaticMarkup(createElement("svg", null, createElement(CyberMagazineArtwork), createElement(CyberMagazineArtwork)));
  const ids = [...together.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test("export embeds literal colors and clamped opacity at 0, 35 and 60 percent", () => {
  for (const [input, expected] of [[0, 0], [35, .98], [60, 1], [100, 1], [-10, 0]]) {
    const rendered = html(<CyberMagazineExportDecor theme={{ ...base, decorOpacity: input }} />);
    assert.ok(rendered.startsWith(`<g opacity="${expected}">`));
    assert.ok(rendered.includes('data-decor="cyber-magazine"'));
    assert.ok(!rendered.includes("var("));
  }
  assert.equal(html(<CyberMagazineExportDecor theme={{ ...base, showDecor: false }} />), "");
  assert.equal(html(<CyberMagazineExportDecor theme={{ ...base, decor: [] }} />), "");
});

test("magazine retains saturated inks at default strength and responds across the slider", () => {
  assert.equal(cyberMagazineOpacity(0), 0);
  assert.equal(cyberMagazineOpacity(35), .98);
  assert.equal(cyberMagazineOpacity(60), 1);
  for (let i = 1; i <= 60; i++) assert.ok(cyberMagazineOpacity(i) > cyberMagazineOpacity(i - 1));
  const profile = html(<ProfileDecorations theme={base} />);
  assert.ok(profile.includes('opacity:0.98'));
  const hidden = html(<ProfileDecorations theme={{ ...base, showDecor: false }} />);
  assert.ok(hidden.includes('opacity:0'));
});
