import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CtaButtonPairProps {
  primaryText: string
  secondaryText: string
  primaryHref?: string
  secondaryHref?: string
  className?: string
}

export function CtaButtonPair({
  primaryText,
  secondaryText,
  primaryHref = "#",
  secondaryHref = "#",
  className,
}: CtaButtonPairProps) {
  const isSecondaryExternal = secondaryHref.startsWith("http")
  const isPrimaryExternal = primaryHref.startsWith("http")

  return (
    <div className={cn("flex flex-col justify-center gap-4 sm:flex-row", className)}>
      <Button size="lg" className="rounded-full px-8" asChild>
        <Link
          href={primaryHref}
          {...(isPrimaryExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {primaryText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
        <Link
          href={secondaryHref}
          {...(isSecondaryExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {secondaryText}
        </Link>
      </Button>
    </div>
  )
}
