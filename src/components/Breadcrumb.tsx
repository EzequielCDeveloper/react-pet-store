import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
  readonly label: string;
  readonly path: string;
}

interface BreadcrumbProps {
  readonly extraCrumbs?: readonly Crumb[];
}
const labelMap: Record<string, string> = {
  "": "Inicio",
  browse: "Explorar",
  pets: "Mascotas",
};

export default function Breadcrumb({ extraCrumbs = [] }: BreadcrumbProps) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: Crumb[] = segments.map((segment, index) => {
    const cumulativePath = "/" + segments.slice(0, index + 1).join("/");
    const label = labelMap[segment] ?? segment;
    return { label, path: cumulativePath };
  });
  const allCrumbs: Crumb[] = [
    { label: "Inicio", path: "/" },
    ...crumbs,
    ...extraCrumbs,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-gray-50 border-b border-gray-100"
    >
      <ol className="flex items-center py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-sm">
        {allCrumbs.map((crumb, index) => {
          const isLast = index === allCrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-gray-900"
                >
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    to={crumb.path}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true" className="mx-2 text-gray-400">
                    <ChevronRight size={14} />
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
