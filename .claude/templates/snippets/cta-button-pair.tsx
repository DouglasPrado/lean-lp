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
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 justify-center", className)}>
      <Button size="lg" className="rounded-full px-8" asChild>
        <Link href={primaryHref}>
          {primaryText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
        <Link href={secondaryHref}>{secondaryText}</Link>
      </Button>
    </div>
  )
}
