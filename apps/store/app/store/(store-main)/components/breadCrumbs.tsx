import ArrowRight from "@mui/icons-material/ArrowRight";
import Home from "@mui/icons-material/Home";
import Link from "next/link";

export function BreadCrumbs({ crumbs }: {crumbs: any[]}) {
  return (
    <nav className="hidden md:flex items-center text-center space-x-2 text-xs text-gray-600 dark:text-gray-300 mb-2 overflow-x-auto whitespace-nowrap">
      <Link href="/store" prefetch={false} className="flex hover:text-blue-600 items-center">
        <Home />
        Store
      </Link>

      {crumbs.map(( crumb, index ) => (
        <div key={crumb._id}>
          <ArrowRight />
          <Link
            href={`/store?categoryId=${crumb._id}`}
            className={`hover:text-blue-600 ${
              index === crumbs.length - 1 ? "text-gray-600 dark:text-gray-300" : ""
            }`}
          >
            {crumb.name}
          </Link>
        </div>
      ))}
    </nav>
  )
}