const LandingIcon = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="mt-8 inline-block w-72 rotate-[8deg] sm:w-full lg:w-[24rem] xl:w-[35rem]"
  >
    <defs>
      <clipPath id="clipping" clipPathUnits="userSpaceOnUse">
        <path
          d="
  M 0, 100
  C 0, 17.000000000000004 17.000000000000004, 0 100, 0
  S 200, 17.000000000000004 200, 100
      183, 200 100, 200
      0, 183 0, 100
"
          fill="#9446ED"
        ></path>
      </clipPath>
    </defs>
    <g clipPath="url(#clipping)">
      <image
        href="img/hero/lucypalooza.png"
        width="200"
        height="200"
        clipPath="url(#clipping)"
      />
    </g>
  </svg>
)

export default LandingIcon
