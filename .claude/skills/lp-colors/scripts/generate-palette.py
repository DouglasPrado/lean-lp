#!/usr/bin/env python3
"""
Generate a complete shadcn/ui + Tailwind color palette from primary and secondary hex colors.

Usage:
  python generate-palette.py --primary "#6366f1" --secondary "#ec4899"
  python generate-palette.py --primary "#6366f1" --secondary "#ec4899" --output ./src
  python generate-palette.py --primary "#6366f1" --secondary "#ec4899" --mode both
  python generate-palette.py --primary "#6366f1" --secondary "#ec4899" --preset minimal
  python generate-palette.py --primary "#6366f1" --secondary "#ec4899" --radius 0.75

Outputs:
  - globals.css (CSS variables for light + dark themes)
  - palette-preview.html (visual preview of the generated palette)
"""

import argparse
import colorsys
import json
import os
import sys
from dataclasses import dataclass


@dataclass
class HSL:
    h: float  # 0-360
    s: float  # 0-100
    l: float  # 0-100

    def to_css(self) -> str:
        return f"{self.h:.1f} {self.s:.1f}% {self.l:.1f}%"

    def to_hex(self) -> str:
        r, g, b = colorsys.hls_to_rgb(self.h / 360, self.l / 100, self.s / 100)
        return f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"

    def adjusted(self, h=None, s=None, l=None) -> "HSL":
        return HSL(
            h=max(0, min(360, h if h is not None else self.h)),
            s=max(0, min(100, s if s is not None else self.s)),
            l=max(0, min(100, l if l is not None else self.l)),
        )


def hex_to_hsl(hex_color: str) -> HSL:
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 3:
        hex_color = "".join(c * 2 for c in hex_color)
    r, g, b = int(hex_color[0:2], 16) / 255, int(hex_color[2:4], 16) / 255, int(hex_color[4:6], 16) / 255
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return HSL(h=h * 360, s=s * 100, l=l * 100)


def get_foreground(bg: HSL) -> HSL:
    """Return white or dark foreground based on background lightness."""
    if bg.l > 55:
        return HSL(bg.h, max(5, bg.s * 0.15), 5)
    return HSL(bg.h, max(5, bg.s * 0.1), 98)


def generate_scale(base: HSL, steps=11) -> dict:
    """Generate a 50-950 color scale from a base color."""
    scale = {}
    labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    lightness_values = [97, 93, 86, 76, 64, 50, 42, 34, 26, 18, 10]

    for label, target_l in zip(labels, lightness_values):
        s_adjust = base.s
        if target_l > 80:
            s_adjust = base.s * 0.6
        elif target_l < 25:
            s_adjust = base.s * 0.8
        scale[label] = base.adjusted(s=s_adjust, l=target_l)
    return scale


def compute_accent(primary: HSL, secondary: HSL) -> HSL:
    """Derive accent color from primary and secondary."""
    h = (primary.h + secondary.h) / 2
    if abs(primary.h - secondary.h) > 180:
        h = (h + 180) % 360
    return HSL(h=h, s=min(80, (primary.s + secondary.s) / 2), l=55)


RADIUS_PRESETS = {
    "sharp": 0,
    "subtle": 0.375,
    "default": 0.5,
    "rounded": 0.75,
    "pill": 1.0,
}

STYLE_PRESETS = {
    "minimal": {"bg_l": 100, "card_l": 100, "muted_s_factor": 0.15, "muted_l": 96, "border_l": 90},
    "soft": {"bg_l": 99, "card_l": 100, "muted_s_factor": 0.25, "muted_l": 95, "border_l": 88},
    "bold": {"bg_l": 98, "card_l": 100, "muted_s_factor": 0.35, "muted_l": 93, "border_l": 85},
    "dark-first": {"bg_l": 98, "card_l": 99, "muted_s_factor": 0.2, "muted_l": 94, "border_l": 87},
}


def generate_theme(primary: HSL, secondary: HSL, preset: str = "soft", radius: float = 0.5):
    style = STYLE_PRESETS.get(preset, STYLE_PRESETS["soft"])
    accent = compute_accent(primary, secondary)

    # ─── Light Theme ───
    light = {
        "background": HSL(primary.h, primary.s * 0.05, style["bg_l"]),
        "foreground": HSL(primary.h, 5, 9),
        "card": HSL(primary.h, primary.s * 0.05, style["card_l"]),
        "card-foreground": HSL(primary.h, 5, 9),
        "popover": HSL(primary.h, primary.s * 0.05, 100),
        "popover-foreground": HSL(primary.h, 5, 9),
        "primary": primary.adjusted(l=max(35, min(55, primary.l))),
        "primary-foreground": get_foreground(primary.adjusted(l=max(35, min(55, primary.l)))),
        "secondary": secondary.adjusted(s=secondary.s * 0.3, l=92),
        "secondary-foreground": secondary.adjusted(l=25),
        "muted": HSL(primary.h, primary.s * style["muted_s_factor"], style["muted_l"]),
        "muted-foreground": HSL(primary.h, 5, 45),
        "accent": accent.adjusted(s=accent.s * 0.25, l=93),
        "accent-foreground": accent.adjusted(l=25),
        "destructive": HSL(0, 84, 60),
        "destructive-foreground": HSL(0, 0, 98),
        "border": HSL(primary.h, primary.s * 0.12, style["border_l"]),
        "input": HSL(primary.h, primary.s * 0.12, style["border_l"]),
        "ring": primary.adjusted(l=max(35, min(55, primary.l))),
        # Chart colors
        "chart-1": primary.adjusted(l=50),
        "chart-2": secondary.adjusted(l=50),
        "chart-3": accent.adjusted(l=45),
        "chart-4": primary.adjusted(h=(primary.h + 30) % 360, l=55),
        "chart-5": secondary.adjusted(h=(secondary.h + 30) % 360, l=55),
        # Sidebar
        "sidebar-background": HSL(primary.h, primary.s * 0.08, 98),
        "sidebar-foreground": HSL(primary.h, 5, 25),
        "sidebar-primary": primary.adjusted(l=max(35, min(55, primary.l))),
        "sidebar-primary-foreground": get_foreground(primary.adjusted(l=max(35, min(55, primary.l)))),
        "sidebar-accent": HSL(primary.h, primary.s * 0.2, 94),
        "sidebar-accent-foreground": HSL(primary.h, 5, 25),
        "sidebar-border": HSL(primary.h, primary.s * 0.1, 91),
        "sidebar-ring": primary.adjusted(l=max(35, min(55, primary.l))),
        # Sparkles / Social Proof
        "gradient-color": primary.adjusted(s=min(90, primary.s * 1.2), l=55),
        "sparkles-color": HSL(primary.h, 5, 9),
        "sparkles-color-dark": HSL(primary.h, 5, 95),
    }

    # ─── Dark Theme ───
    dark = {
        "background": HSL(primary.h, primary.s * 0.15, 5),
        "foreground": HSL(primary.h, 5, 95),
        "card": HSL(primary.h, primary.s * 0.12, 7),
        "card-foreground": HSL(primary.h, 5, 95),
        "popover": HSL(primary.h, primary.s * 0.12, 7),
        "popover-foreground": HSL(primary.h, 5, 95),
        "primary": primary.adjusted(l=max(55, min(70, primary.l + 15))),
        "primary-foreground": HSL(primary.h, primary.s * 0.3, 8),
        "secondary": HSL(secondary.h, secondary.s * 0.15, 15),
        "secondary-foreground": HSL(secondary.h, 5, 90),
        "muted": HSL(primary.h, primary.s * 0.1, 15),
        "muted-foreground": HSL(primary.h, 5, 60),
        "accent": HSL(accent.h, accent.s * 0.15, 15),
        "accent-foreground": HSL(accent.h, 5, 90),
        "destructive": HSL(0, 72, 50),
        "destructive-foreground": HSL(0, 0, 98),
        "border": HSL(primary.h, primary.s * 0.1, 15),
        "input": HSL(primary.h, primary.s * 0.1, 15),
        "ring": primary.adjusted(l=max(55, min(70, primary.l + 15))),
        # Chart colors
        "chart-1": primary.adjusted(l=60),
        "chart-2": secondary.adjusted(l=60),
        "chart-3": accent.adjusted(l=55),
        "chart-4": primary.adjusted(h=(primary.h + 30) % 360, l=65),
        "chart-5": secondary.adjusted(h=(secondary.h + 30) % 360, l=65),
        # Sidebar
        "sidebar-background": HSL(primary.h, primary.s * 0.12, 6),
        "sidebar-foreground": HSL(primary.h, 5, 90),
        "sidebar-primary": primary.adjusted(l=max(55, min(70, primary.l + 15))),
        "sidebar-primary-foreground": HSL(primary.h, primary.s * 0.3, 8),
        "sidebar-accent": HSL(primary.h, primary.s * 0.1, 14),
        "sidebar-accent-foreground": HSL(primary.h, 5, 90),
        "sidebar-border": HSL(primary.h, primary.s * 0.1, 14),
        "sidebar-ring": primary.adjusted(l=max(55, min(70, primary.l + 15))),
        # Sparkles / Social Proof
        "gradient-color": primary.adjusted(s=min(90, primary.s * 1.2), l=55),
        "sparkles-color": HSL(primary.h, 5, 9),
        "sparkles-color-dark": HSL(primary.h, 5, 95),
    }

    return light, dark, radius


def generate_globals_css(light: dict, dark: dict, radius: float) -> str:
    lines = ['@import "tailwindcss";', "", "@custom-variant dark (&:is(.dark *));", ""]
    lines.append("@theme inline {")
    # Color mappings
    color_keys = [
        "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
        "primary", "primary-foreground", "secondary", "secondary-foreground",
        "muted", "muted-foreground", "accent", "accent-foreground",
        "destructive", "destructive-foreground", "border", "input", "ring",
        "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
        "sidebar-background", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground",
        "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring",
        "gradient-color", "sparkles-color", "sparkles-color-dark",
    ]
    for key in color_keys:
        lines.append(f"  --color-{key}: hsl(var(--{key}));")
    lines.append(f"  --radius: {radius}rem;")
    lines.append("}")
    lines.append("")

    # Light theme
    lines.append(":root {")
    for key in color_keys:
        if key in light:
            lines.append(f"  --{key}: {light[key].to_css()};")
    lines.append("}")
    lines.append("")

    # Dark theme
    lines.append(".dark {")
    for key in color_keys:
        if key in dark:
            lines.append(f"  --{key}: {dark[key].to_css()};")
    lines.append("}")
    lines.append("")

    # Keyframes & Animations (Tailwind v4 CSS-native)
    lines.append("@theme {")
    lines.append("  --animate-fade-up: fade-up 0.5s ease-out forwards;")
    lines.append("  --animate-fade-in: fade-in 0.5s ease-out forwards;")
    lines.append("  --animate-scale-in: scale-in 0.3s ease-out forwards;")
    lines.append("  --animate-accordion-down: accordion-down 0.2s ease-out;")
    lines.append("  --animate-accordion-up: accordion-up 0.2s ease-out;")
    lines.append("}")
    lines.append("")
    lines.append("@keyframes fade-up {")
    lines.append("  0% { opacity: 0; transform: translateY(20px); }")
    lines.append("  100% { opacity: 1; transform: translateY(0); }")
    lines.append("}")
    lines.append("")
    lines.append("@keyframes fade-in {")
    lines.append("  0% { opacity: 0; }")
    lines.append("  100% { opacity: 1; }")
    lines.append("}")
    lines.append("")
    lines.append("@keyframes scale-in {")
    lines.append("  0% { opacity: 0; transform: scale(0.95); }")
    lines.append("  100% { opacity: 1; transform: scale(1); }")
    lines.append("}")
    lines.append("")
    lines.append("@keyframes accordion-down {")
    lines.append("  from { height: 0; }")
    lines.append("  to { height: var(--radix-accordion-content-height); }")
    lines.append("}")
    lines.append("")
    lines.append("@keyframes accordion-up {")
    lines.append("  from { height: var(--radix-accordion-content-height); }")
    lines.append("  to { height: 0; }")
    lines.append("}")
    lines.append("")

    # Base styles
    lines.append("@layer base {")
    lines.append("  * {")
    lines.append("    @apply border-border;")
    lines.append("  }")
    lines.append("  body {")
    lines.append("    @apply bg-background text-foreground;")
    lines.append("  }")
    lines.append("}")

    return "\n".join(lines)


def generate_tailwind_config() -> str:
    return '''import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
'''


def generate_preview_html(light: dict, dark: dict, primary_hex: str, secondary_hex: str) -> str:
    """Generate an HTML preview of the palette."""
    rows_light = ""
    rows_dark = ""
    display_keys = [
        "background", "foreground", "primary", "primary-foreground",
        "secondary", "secondary-foreground", "muted", "muted-foreground",
        "accent", "accent-foreground", "destructive", "destructive-foreground",
        "border", "ring", "card", "card-foreground",
        "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
    ]

    for key in display_keys:
        if key in light:
            hex_l = light[key].to_hex()
            hsl_l = light[key].to_css()
            rows_light += f'''
      <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f0f0f0">
        <div style="width:48px;height:48px;border-radius:8px;background:{hex_l};border:1px solid #e0e0e0;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">--{key}</div>
          <div style="font-size:12px;color:#666">{hex_l} | {hsl_l}</div>
        </div>
      </div>'''

        if key in dark:
            hex_d = dark[key].to_hex()
            hsl_d = dark[key].to_css()
            rows_dark += f'''
      <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #333">
        <div style="width:48px;height:48px;border-radius:8px;background:{hex_d};border:1px solid #444;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px;color:#eee">--{key}</div>
          <div style="font-size:12px;color:#999">{hex_d} | {hsl_d}</div>
        </div>
      </div>'''

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Palette Preview — {primary_hex} + {secondary_hex}</title>
  <style>
    * {{ margin:0; padding:0; box-sizing:border-box; }}
    body {{ font-family: system-ui, -apple-system, sans-serif; }}
  </style>
</head>
<body>
  <div style="max-width:1200px;margin:0 auto;padding:32px">
    <h1 style="font-size:28px;font-weight:700;margin-bottom:8px">Color Palette Preview</h1>
    <p style="color:#666;margin-bottom:32px">
      Primary: <strong>{primary_hex}</strong> &nbsp;|&nbsp; Secondary: <strong>{secondary_hex}</strong>
    </p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">
      <!-- Light theme -->
      <div style="background:#fff;padding:24px;border-radius:16px;border:1px solid #e0e0e0">
        <h2 style="font-size:18px;font-weight:600;margin-bottom:16px">Light Theme</h2>
        {rows_light}
      </div>

      <!-- Dark theme -->
      <div style="background:#0a0a0a;padding:24px;border-radius:16px;border:1px solid #333">
        <h2 style="font-size:18px;font-weight:600;margin-bottom:16px;color:#fff">Dark Theme</h2>
        {rows_dark}
      </div>
    </div>

    <!-- Button preview -->
    <div style="margin-top:32px;padding:24px;border:1px solid #e0e0e0;border-radius:16px">
      <h2 style="font-size:18px;font-weight:600;margin-bottom:16px">Component Preview</h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <button style="background:{light['primary'].to_hex()};color:{light['primary-foreground'].to_hex()};padding:10px 24px;border-radius:999px;border:none;font-weight:600;font-size:14px;cursor:pointer">
          Primary CTA
        </button>
        <button style="background:transparent;color:{light['primary'].to_hex()};padding:10px 24px;border-radius:999px;border:2px solid {light['border'].to_hex()};font-weight:600;font-size:14px;cursor:pointer">
          Secondary CTA
        </button>
        <button style="background:{light['destructive'].to_hex()};color:{light['destructive-foreground'].to_hex()};padding:10px 24px;border-radius:999px;border:none;font-weight:600;font-size:14px;cursor:pointer">
          Destructive
        </button>
        <span style="background:{light['muted'].to_hex()};color:{light['muted-foreground'].to_hex()};padding:6px 14px;border-radius:999px;font-size:12px;font-weight:500">
          Badge
        </span>
      </div>

      <!-- Card preview -->
      <div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        <div style="background:{light['card'].to_hex()};border:1px solid {light['border'].to_hex()};border-radius:16px;padding:20px">
          <div style="width:32px;height:32px;border-radius:8px;background:{light['primary'].to_hex()};opacity:0.15;margin-bottom:12px"></div>
          <div style="font-weight:600;font-size:14px;color:{light['card-foreground'].to_hex()}">Feature Card</div>
          <div style="font-size:13px;color:{light['muted-foreground'].to_hex()};margin-top:4px">Card with muted text description.</div>
        </div>
        <div style="background:{light['accent'].to_hex()};border:1px solid {light['border'].to_hex()};border-radius:16px;padding:20px">
          <div style="font-weight:600;font-size:14px;color:{light['accent-foreground'].to_hex()}">Accent Card</div>
          <div style="font-size:13px;color:{light['muted-foreground'].to_hex()};margin-top:4px">Using accent background.</div>
        </div>
        <div style="background:{light['secondary'].to_hex()};border:1px solid {light['border'].to_hex()};border-radius:16px;padding:20px">
          <div style="font-weight:600;font-size:14px;color:{light['secondary-foreground'].to_hex()}">Secondary Card</div>
          <div style="font-size:13px;color:{light['muted-foreground'].to_hex()};margin-top:4px">Using secondary background.</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>'''


def main():
    parser = argparse.ArgumentParser(description="Generate shadcn/ui color palette from primary + secondary colors")
    parser.add_argument("--primary", required=True, help="Primary brand color (hex, e.g. #6366f1)")
    parser.add_argument("--secondary", required=True, help="Secondary brand color (hex, e.g. #ec4899)")
    parser.add_argument("--output", default=".", help="Output directory (default: current dir)")
    parser.add_argument("--preset", default="soft", choices=["minimal", "soft", "bold", "dark-first"],
                        help="Style preset (default: soft)")
    parser.add_argument("--radius", type=float, default=0.5, help="Border radius in rem (default: 0.5)")
    parser.add_argument("--mode", default="all", choices=["globals", "tailwind", "both", "all"],
                        help="What to generate: globals (CSS only, recommended for Tailwind v4), tailwind (legacy v3 config), both, all (globals + preview HTML)")
    parser.add_argument("--preview", action="store_true", help="Also generate preview HTML")

    args = parser.parse_args()

    try:
        primary = hex_to_hsl(args.primary)
        secondary = hex_to_hsl(args.secondary)
    except (ValueError, IndexError):
        print("Error: Invalid hex color. Use format #RRGGBB or #RGB")
        sys.exit(1)

    os.makedirs(args.output, exist_ok=True)

    light, dark, radius = generate_theme(primary, secondary, args.preset, args.radius)

    generated = []

    # "all" = globals + preview (Tailwind v4 default — no config file needed)
    # "both" = globals + tailwind config (legacy)
    if args.mode in ("globals", "both", "all"):
        css = generate_globals_css(light, dark, radius)
        css_path = os.path.join(args.output, "globals.css")
        with open(css_path, "w") as f:
            f.write(css)
        generated.append(f"  globals.css → {css_path}")

    if args.preview or args.mode == "all":
        html = generate_preview_html(light, dark, args.primary, args.secondary)
        html_path = os.path.join(args.output, "palette-preview.html")
        with open(html_path, "w") as f:
            f.write(html)
        generated.append(f"  palette-preview.html → {html_path}")

    print(f"\n✅ Palette generated from:")
    print(f"   Primary:   {args.primary} → HSL({primary.to_css()})")
    print(f"   Secondary: {args.secondary} → HSL({secondary.to_css()})")
    print(f"   Preset:    {args.preset}")
    print(f"   Radius:    {radius}rem")
    print(f"\n📁 Files created:")
    for g in generated:
        print(g)
    print()


if __name__ == "__main__":
    main()
