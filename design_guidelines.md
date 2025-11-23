# Design Guidelines: Pharmaceutical E-Commerce Platform

## Design Approach

**Selected Approach:** Hybrid - E-commerce best practices (Shopify, Amazon Pharmacy) + Material Design system for healthcare trust and accessibility

**Key Principles:**
- Professional credibility and medical trust
- Clear product information hierarchy
- Efficient browsing and purchasing flow
- Accessibility for all age groups

## Typography System

**Font Families:**
- Primary: Inter (headings, navigation, buttons)
- Secondary: System UI (body text, product descriptions)

**Hierarchy:**
- Hero/Main Headlines: text-4xl to text-5xl, font-semibold
- Section Headers: text-3xl, font-semibold
- Product Titles: text-xl, font-medium
- Category Labels: text-sm, font-medium, uppercase tracking-wide
- Body Text: text-base, leading-relaxed
- Product Descriptions: text-sm, text-gray-600
- Prices: text-2xl, font-bold (prominent display)
- Legal/Fine Print: text-xs

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8
- Grid gutters: gap-4 to gap-6

**Container Strategy:**
- Page container: max-w-7xl mx-auto px-4
- Product grids: max-w-6xl
- Checkout forms: max-w-2xl
- Content sections: max-w-4xl

## Component Library

### Navigation
- Sticky header with logo left, navigation center, cart icon right
- Search bar prominent in header (full-width on mobile)
- Category mega-menu dropdown
- Breadcrumb navigation on product/category pages
- Mobile: Hamburger menu with slide-out drawer

### Hero Section
- Medium height (60vh), professional pharmaceutical imagery
- Overlay with centered headline + CTA
- Blurred background buttons for "Ver Productos" and "Contactar"
- Trust indicators below fold (certifications, shipping info)

### Product Catalog
**Grid Layout:**
- Desktop: 4 columns (grid-cols-4)
- Tablet: 3 columns (grid-cols-3)
- Mobile: 2 columns (grid-cols-2)

**Product Cards:**
- Card structure: Image (square aspect ratio) + Product name + Category tag + Price + "Agregar" button
- Hover: Subtle elevation increase (shadow-lg)
- Badge system: "Receta requerida", "Nuevo", "Oferta"
- Stock indicators where relevant

### Filtering Sidebar
- Left-aligned on desktop (w-64)
- Collapsible on tablet/mobile
- Category checkboxes with counts
- Price range slider
- Clear filters button at bottom

### Shopping Cart
- Slide-out panel from right (fixed, z-50)
- Line items with thumbnail, name, quantity selector, price
- Running subtotal
- Prominent "Proceder al Pago" button
- Empty state with "Continuar Comprando" CTA

### Checkout/Order Form
- Single-column form layout (max-w-2xl)
- Grouped sections: Contact Info → Delivery Address → Payment Method
- Progress indicator at top (3 steps)
- Order summary sticky on right (desktop)
- Clear field labels, required indicators
- Input validation with helpful error messages

### Product Detail Page
- Two-column layout: Image gallery left (60%), Product info right (40%)
- Image: Large primary + thumbnail strip
- Info hierarchy: Name → Category → Price → Stock status → Description → "Agregar al Carrito"
- Accordion sections: Ingredients, Usage Instructions, Warnings
- Related products carousel at bottom

### Footer
- Three-column layout: Company info + Customer service links + Legal/certifications
- Newsletter signup with email input
- Contact phone number prominent
- Payment method icons
- Required pharmaceutical disclaimers

## Page-Specific Layouts

**Homepage:**
1. Hero with search
2. Category cards (3-4 columns) - Medicamentos, Suplementos, Cuidado Personal, Primeros Auxilios
3. Featured products grid (4 columns)
4. Trust section (certifications, shipping, support)
5. Newsletter signup
6. Footer

**Category Pages:**
- Filtering sidebar (left 1/4) + Product grid (right 3/4)
- Sort dropdown (top right): Por precio, Por nombre, Más vendidos
- Pagination at bottom

**Order Confirmation:**
- Centered card (max-w-2xl)
- Success icon + confirmation message
- Order details table
- Delivery timeline
- "Ver mis pedidos" + "Continuar comprando" buttons

## Images

**Hero Section:**
- Professional pharmaceutical imagery: Clean modern pharmacy interior, healthcare professional, or product array
- High-quality, bright, conveys trust and professionalism
- Dimensions: 1920x1080 minimum, good for 16:9 aspect

**Product Images:**
- Square format (1:1 aspect ratio), 800x800px minimum
- White or light neutral background
- Consistent lighting and angle across catalog
- Multiple views for detail pages

**Category Headers:**
- Subtle background images for category sections
- Pills/supplements, personal care items, medical supplies as appropriate

**Trust Badges:**
- Certification logos, payment icons, shipping badges
- Place in hero trust bar and footer

## Animations

Minimal, professional interactions only:
- Product card hover: scale(1.02) + shadow increase
- Cart slide-in: translateX animation (300ms)
- Form validation: gentle shake on error
- Success confirmations: subtle fade-in
- NO autoplay carousels or distracting effects

## Accessibility Notes

- High contrast text (AA minimum)
- Form labels always visible
- Focus states clearly visible (ring-2 ring-blue-500)
- Touch targets minimum 44x44px
- Screen reader announcements for cart updates
- Keyboard navigation throughout