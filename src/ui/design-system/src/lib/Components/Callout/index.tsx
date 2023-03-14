import AppLink from "../AppLink"

export type CalloutProps = {
  heading: string
  description: string
  ctaText: string
  ctaLink: string
}

const Callout = ({ heading, description, ctaText, ctaLink }: CalloutProps) => {
  return (
    <div
      className="md:py-15 flex flex-col items-start justify-between rounded-2xl p-10 dark:bg-primary-gray-dark md:flex-row md:items-center md:px-20"
      style={{ backgroundColor: "rgba(222,226,233, 0.5)" }}
    >
      <div className="flex-1">
        <h4 className="text-h4">{heading}</h4>
        <p className="pt-2 dark:text-primary-gray-100">{description}</p>
      </div>
      <AppLink
        className="h-14 rounded-lg bg-black px-16 py-5 text-sm text-white hover:cursor-pointer"
        to={ctaLink}
      >
        {ctaText}
      </AppLink>
    </div>
  )
}

export default Callout
