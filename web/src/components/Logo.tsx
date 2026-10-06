// The Brydge wordmark (public/brand/logo.png) used as a CSS mask, so it takes
// the current text colour: espresso on cream, cream on espresso.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Brydge — Built for you"
      className={`block bg-current ${className}`}
      style={{
        aspectRatio: "3666 / 1128",
        maskImage: "url(/brand/logo.png)",
        WebkitMaskImage: "url(/brand/logo.png)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
