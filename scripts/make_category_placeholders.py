import os

OUT_DIR = "public/images/placeholders"
os.makedirs(OUT_DIR, exist_ok=True)

CATEGORIES = [
    {
        "id": "ghee",
        "title": "Desi Ghee",
        "hindi": "शुद्ध देशी घी",
        "subtitle": "Traditional Bilona & Vedic Churned Ghee",
        "icon": '<path d="M12 2c0 4-4 6-4 10a6 6 0 0 0 12 0c0-4-4-6-4-10z" fill="#D97706" opacity="0.9"/>',
        "accent": "#F59E0B",
        "bg_grad": "from-amber-50 to-orange-100",
        "bg1": "#FFFBEB",
        "bg2": "#FEF3C7"
    },
    {
        "id": "milk",
        "title": "Fresh Milk",
        "hindi": "ताज़ा शुद्ध दूध",
        "subtitle": "Chilled Pure Farm Milk • Untouched by Hand",
        "icon": '<path d="M8 2h8v2H8zm-1 4h10l-1 14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#0284C7" opacity="0.9"/>',
        "accent": "#0284C7",
        "bg1": "#F0F9FF",
        "bg2": "#E0F2FE"
    },
    {
        "id": "butter",
        "title": "Butter & Makkhan",
        "hindi": "देशी सफेद मक्खन",
        "subtitle": "Hand-Churned Safed Makkhan & Table Butter",
        "icon": '<rect x="4" y="6" width="16" height="12" rx="3" fill="#D97706" opacity="0.9"/><circle cx="12" cy="12" r="3" fill="#FEF3C7"/>',
        "accent": "#F59E0B",
        "bg1": "#FFFBEB",
        "bg2": "#FEF3C7"
    },
    {
        "id": "paneer",
        "title": "Fresh Malai Paneer",
        "hindi": "मलाई पनीर",
        "subtitle": "100% Whole Cow Milk • Soft & Velvety",
        "icon": '<rect x="4" y="4" width="7" height="7" rx="1.5" fill="#10B981"/><rect x="13" y="4" width="7" height="7" rx="1.5" fill="#059669"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="#059669"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="#10B981"/>',
        "accent": "#10B981",
        "bg1": "#ECFDF5",
        "bg2": "#D1FAE5"
    },
    {
        "id": "cream",
        "title": "Fresh Malai & Cream",
        "hindi": "गाढ़ी मलाई व क्रीम",
        "subtitle": "Thick Clotted Cream & Cooking Malai",
        "icon": '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#D97706" opacity="0.9"/>',
        "accent": "#F59E0B",
        "bg1": "#FFFBEB",
        "bg2": "#FEF3C7"
    },
    {
        "id": "curd-dahi",
        "title": "Curd & Matka Dahi",
        "hindi": "पारंपरिक मटका दही",
        "subtitle": "Natural Clay-Set Dahi & Mishti Doi",
        "icon": '<path d="M6 9h12v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9zm1-5h10a2 2 0 0 1 2 2v1H5V6a2 2 0 0 1 2-2z" fill="#0284C7" opacity="0.85"/>',
        "accent": "#0284C7",
        "bg1": "#F0F9FF",
        "bg2": "#E0F2FE"
    },
    {
        "id": "cheese",
        "title": "Artisanal Cheese",
        "hindi": "शुद्ध दुग्ध चीज़",
        "subtitle": "Farmhouse Mozzarella, Cheddar & Chhena",
        "icon": '<path d="M3 13l9-9 9 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" fill="#D97706" opacity="0.9"/><circle cx="10" cy="14" r="1.5" fill="#FFFBEB"/><circle cx="15" cy="16" r="1" fill="#FFFBEB"/>',
        "accent": "#D97706",
        "bg1": "#FFFBEB",
        "bg2": "#FEF3C7"
    },
    {
        "id": "mithai",
        "title": "Shuddh Desi Mithai",
        "hindi": "शुद्ध देशी घी मिठाई",
        "subtitle": "Artisan Royal Sweets • Pure Cow Ghee",
        "icon": '<polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" fill="#D97706" opacity="0.95"/>',
        "accent": "#D97706",
        "bg1": "#FFF7ED",
        "bg2": "#FFEDD5"
    },
    {
        "id": "combo-packs",
        "title": "Daily Combo Packs",
        "hindi": "दैनिक कॉम्बो पैक",
        "subtitle": "Morning Essentials & Savings Bundles",
        "icon": '<rect x="3" y="7" width="18" height="14" rx="2" fill="#10B981" opacity="0.9"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" fill="#059669"/>',
        "accent": "#10B981",
        "bg1": "#ECFDF5",
        "bg2": "#D1FAE5"
    },
    {
        "id": "gift-boxes",
        "title": "Royal Gift Boxes",
        "hindi": "शाही उपहार डब्बे",
        "subtitle": "Heritage Festive Hampers & Mithai Boxes",
        "icon": '<rect x="3" y="8" width="18" height="13" rx="2" fill="#9333EA" opacity="0.9"/><path d="M12 8v13m-9-7h18" stroke="#FEF08A" stroke-width="2"/><path d="M12 8a3 3 0 0 0-3-3c-1.5 0-3 1.5-1 3zm0 0a3 3 0 0 1 3-3c1.5 0 3 1.5 1 3z" fill="#FEF08A"/>',
        "accent": "#9333EA",
        "bg1": "#FAF5FF",
        "bg2": "#F3E8FF"
    },
    {
        "id": "default",
        "title": "DesiDhar Authentic Dairy",
        "hindi": "खालिस देशी • सीधा घर तक",
        "subtitle": "100% Pure Indian Farm Dairy & Mithai",
        "icon": '<circle cx="12" cy="12" r="9" fill="#D97706" opacity="0.9"/><path d="M12 7v10M7 12h10" stroke="#FFFBEB" stroke-width="2"/>',
        "accent": "#D97706",
        "bg1": "#FFFDF7",
        "bg2": "#FEF3C7"
    }
]

def make_svg(item):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{item['bg1']}"/>
      <stop offset="100%" stop-color="{item['bg2']}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#78350F" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="url(#bgGrad)"/>

  <!-- Ornate Border -->
  <rect x="32" y="32" width="736" height="736" rx="28" fill="none" stroke="{item['accent']}" stroke-width="2" stroke-opacity="0.35"/>
  <rect x="44" y="44" width="712" height="712" rx="22" fill="none" stroke="{item['accent']}" stroke-width="1" stroke-dasharray="8 6" stroke-opacity="0.25"/>

  <!-- Brand Emblem Top -->
  <g transform="translate(400, 110)">
    <text text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="#78350F" letter-spacing="4">DESIDHAR</text>
    <text y="24" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="12" fill="#92400E" letter-spacing="2">KHAALIS DESI • SEEDHA GHAR TAK</text>
  </g>

  <!-- Central Card -->
  <g filter="url(#shadow)">
    <rect x="140" y="180" width="520" height="440" rx="32" fill="#FFFFFF" fill-opacity="0.95" stroke="#FDE68A" stroke-width="2"/>
  </g>

  <!-- Center Category Icon Circle -->
  <g transform="translate(400, 310)">
    <circle r="72" fill="{item['bg1']}" stroke="{item['accent']}" stroke-width="3" stroke-opacity="0.4"/>
    <g transform="translate(-36, -36) scale(3)">
      {item['icon']}
    </g>
  </g>

  <!-- Category Title & Hindi -->
  <text x="400" y="435" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="32" fill="#292524">{item['title']}</text>
  <text x="400" y="475" text-anchor="middle" font-family="'Noto Sans Devanagari', system-ui, sans-serif" font-weight="700" font-size="26" fill="{item['accent']}">{item['hindi']}</text>

  <!-- Subtitle -->
  <text x="400" y="525" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="16" fill="#78716C">{item['subtitle']}</text>

  <!-- Studio Shot Pending Badge -->
  <g transform="translate(400, 575)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="{item['bg1']}" stroke="{item['accent']}" stroke-width="1.5"/>
    <circle cx="-115" cy="0" r="4" fill="{item['accent']}"/>
    <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#78350F" letter-spacing="0.5">STUDIO SHOT IN PROGRESS</text>
  </g>

  <!-- Bottom Guarantee -->
  <g transform="translate(400, 690)">
    <text text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="14" fill="#059669">✓ 100% Shuddh Desi Quality • FSSAI Certified</text>
    <text y="24" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="12" fill="#A8A29E">Fresh Batch Packed Daily</text>
  </g>
</svg>'''
    return svg

for item in CATEGORIES:
    filename = f"category-{item['id']}.svg" if item['id'] != 'default' else 'product-placeholder.svg'
    path = os.path.join(OUT_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(make_svg(item))
    print(f"Created: {path}")

print("All category placeholder SVGs generated successfully!")
