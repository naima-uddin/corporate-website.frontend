import {
  FileText,
  Settings,
  Users,
  ShoppingCart,
  Image as ImageIcon,
  Images,
  Briefcase,
  Building2,
  Camera,
  PanelBottom,
  Newspaper,
  LayoutDashboard,
  Palette,
  Quote,
  Users2,
  Info,
  Landmark,
  FolderKanban,
  Phone,
  Menu,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    id: "overview",
    label: null,
    items: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    id: "homepage",
    label: "Homepage",
    items: [
      { id: "banner", label: "Manage Banner", icon: ImageIcon, href: "/dashboard/banner" },
      { id: "spotlight", label: "Leadership Spotlight", icon: Quote, href: "/dashboard/spotlight" },
      { id: "join-us", label: "Join Us Section", icon: Users2, href: "/dashboard/join-us" },
      { id: "client-showcase", label: "Client Showcase", icon: Building2, href: "/dashboard/client-showcase" },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    items: [
      { id: "about", label: "About Page", icon: Info, href: "/dashboard/about" },
      { id: "government-enlistment", label: "Government Enlistment", icon: Landmark, href: "/dashboard/government-enlistment" },
      { id: "projects-page", label: "Projects Page Settings", icon: FolderKanban, href: "/dashboard/projects-page" },
      { id: "contact-page", label: "Contact Page", icon: Phone, href: "/dashboard/contact-page" },
    ],
  },
  {
    id: "work",
    label: "Services & Work",
    items: [
      { id: "services", label: "Manage Services", icon: ShoppingCart, href: "/dashboard/services" },
      { id: "portfolio", label: "Manage Contracts/Projects", icon: Briefcase, href: "/dashboard/portfolio" },
      { id: "gallery", label: "Manage Gallery", icon: Camera, href: "/dashboard/gallery" },
    ],
  },
  {
    id: "articles",
    label: "Blog & News",
    items: [
      { id: "blog", label: "Manage Blog", icon: FileText, href: "/dashboard/blog" },
      { id: "news", label: "Manage News", icon: Newspaper, href: "/dashboard/news" },
    ],
  },
  {
    id: "site-wide",
    label: "Site-wide",
    items: [
      { id: "site-branding", label: "Site Branding", icon: Palette, href: "/dashboard/site-branding" },
      { id: "navbar-menu", label: "Navbar Menu", icon: Menu, href: "/dashboard/navbar-menu" },
      { id: "footer", label: "Manage Footer", icon: PanelBottom, href: "/dashboard/footer" },
      { id: "media", label: "All Media", icon: Images, href: "/dashboard/media" },
    ],
  },
];

export const ADMIN_NAV_SECTION = {
  id: "admin",
  label: "Administration",
  items: [
    { id: "users", label: "Manage Users", icon: Users, href: "/dashboard/users" },
  ],
};

export const ACCOUNT_NAV_SECTION = {
  id: "account",
  label: "Account",
  items: [
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ],
};

// Human-friendly labels for path segments that aren't top-level nav items
// (nested actions like /new, /edit, or section sub-pages).
export const SEGMENT_LABEL_OVERRIDES = {
  dashboard: "Dashboard",
  new: "New",
  edit: "Edit",
  group: "Group",
};
