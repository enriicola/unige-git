import NextLink from 'next/link';

export default function APPLink({ href, className, props, children }) {
  return (
    <NextLink
      href={href}
      className={`
        px-4 py-2
        rounded-[15px]
        border
        border-primary-600
        text-primary-600
        text-[0.9rem]
        no-underline
        hover:bg-primary-600/10
        transition-colors
        ${className}
      `}
      {...props}
    >
      {children}
    </NextLink>
  );
}
