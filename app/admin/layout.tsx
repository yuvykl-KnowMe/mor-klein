import Link from "next/link";

const tabs = [
  { href: "/admin", label: "פניות" },
  { href: "/admin/patients", label: "מטופלים" },
  { href: "/admin/week", label: "יומן" },
  { href: "/admin/content", label: "תוכן" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav
        aria-label="ניווט ניהול"
        className="border-b border-line bg-surface/60"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-1 px-4 py-3 text-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="inline-flex min-h-8 items-center font-heading font-bold text-accent-deep transition-colors hover:text-accent-deeper"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
      {children}
    </div>
  );
}
