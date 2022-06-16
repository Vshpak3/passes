import { useTheme } from "next-themes"

const BackgroundGrainy = () => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="absolute inset-0 top-0 grid h-full w-full grid-cols-4">
      <div className="h-full w-full bg-crimson-crimson9" />
      <div className="h-full w-full bg-pink-pink9" />
      <div className="h-full w-full bg-plum-plum9" />
      <div className="h-full w-full bg-purple-purple9" />
      <div className="h-full w-full bg-violet-violet9" />
      <div className="h-full w-full bg-violet-violet9" />
      <div className="h-full w-full bg-indigo-indigo9" />
      <div className="h-full w-full bg-blue-blue9" />
      <div className="absolute h-full w-full bg-white/60 backdrop-blur-3xl backdrop-saturate-200 dark:bg-black/60" />
      <svg
        style={{
          filter:
            "contrast(300%) brightness(100%)" +
            (resolvedTheme === "dark" ? " invert(1)" : "")
        }}
        id="texture"
        className="absolute h-full w-full"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".8"
            numOctaves="4"
            stitchTiles="stitch"
          ></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"></rect>
      </svg>
      <svg
        className="absolute h-full w-full opacity-30 mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="pattern-blue-false"
            patternUnits="userSpaceOnUse"
            width="3.5"
            height="3.5"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y="0"
              x2="0"
              y2="3.5"
              stroke="blue"
              strokeWidth="1"
            ></line>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#pattern-blue-false)"
          opacity="1"
        ></rect>
      </svg>
    </div>
  )
}

export default BackgroundGrainy
