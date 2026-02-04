import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ArticleBreadcrumbsProps {
  category: string;
  title: string;
}

const categoryRoutes: Record<string, { path: string; label: string }> = {
  crypto: { path: "/crypto", label: "Crypto" },
  global_markets: { path: "/markets", label: "Markets" },
  commodities: { path: "/markets", label: "Commodities" },
};

export function ArticleBreadcrumbs({ category, title }: ArticleBreadcrumbsProps) {
  const categoryInfo = categoryRoutes[category] || { path: "/", label: "News" };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={categoryInfo.path}>{categoryInfo.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[200px] truncate">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
