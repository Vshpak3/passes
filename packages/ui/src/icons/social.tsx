// Adapted from: https://icons.modulz.app

export const Social = ({
  width = 15,
  height = 15,
  variant,
  ...restOfProps
}: {
  height?: number
  width?: number
  variant: string
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    {variant === 'Discord' ? (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.075 1.826a.48.48 0 00-.127-.003c-.841.091-2.121.545-2.877.955a.48.48 0 00-.132.106c-.314.359-.599.944-.822 1.498C.887 4.95.697 5.55.59 5.984.236 7.394.043 9.087.017 10.693a.48.48 0 00.056.23c.3.573.947 1.104 1.595 1.492.655.393 1.42.703 2.036.763a.48.48 0 00.399-.153c.154-.167.416-.557.614-.86.09-.138.175-.27.241-.375.662.12 1.492.19 2.542.19 1.048 0 1.878-.07 2.54-.19.066.106.15.237.24.374.198.304.46.694.615.861a.48.48 0 00.399.153c.616-.06 1.38-.37 2.035-.763.648-.388 1.295-.919 1.596-1.492a.48.48 0 00.055-.23c-.025-1.606-.219-3.3-.571-4.71a12.98 12.98 0 00-.529-1.601c-.223-.554-.508-1.14-.821-1.498a.48.48 0 00-.133-.106c-.755-.41-2.035-.864-2.877-.955a.48.48 0 00-.126.003 1.18 1.18 0 00-.515.238 2.905 2.905 0 00-.794.999A14.046 14.046 0 007.5 3.02c-.402 0-.774.015-1.117.042a2.905 2.905 0 00-.794-.998 1.18 1.18 0 00-.514-.238zm5.943 9.712a23.136 23.136 0 00.433.643c.396-.09.901-.3 1.385-.59.543-.325.974-.7 1.182-1.017-.033-1.506-.219-3.07-.54-4.358a12.046 12.046 0 00-.488-1.475c-.2-.498-.415-.92-.602-1.162-.65-.337-1.675-.693-2.343-.79a.603.603 0 00-.058.04 1.5 1.5 0 00-.226.22c-.041.05-.08.098-.113.145.305.056.577.123.818.197.684.21 1.177.5 1.418.821a.48.48 0 11-.768.576c-.059-.078-.316-.29-.932-.48-.595-.182-1.47-.328-2.684-.328-1.214 0-2.09.146-2.684.329-.616.19-.873.4-.932.479a.48.48 0 11-.768-.576c.241-.322.734-.61 1.418-.82.24-.075.512-.141.816-.197a2.213 2.213 0 00-.114-.146 1.5 1.5 0 00-.225-.22.604.604 0 00-.059-.04c-.667.097-1.692.453-2.342.79-.188.243-.402.664-.603 1.162-.213.53-.39 1.087-.487 1.475-.322 1.288-.508 2.852-.54 4.358.208.318.638.692 1.181 1.018.485.29.989.5 1.386.589a16.32 16.32 0 00.433-.643c-.785-.279-1.206-.662-1.48-1.072a.48.48 0 01.8-.532c.26.392.944 1.086 4.2 1.086 3.257 0 3.94-.694 4.2-1.086a.48.48 0 01.8.532c-.274.41-.696.794-1.482 1.072zM4.08 7.012c.244-.262.575-.41.92-.412.345.002.676.15.92.412.243.263.38.618.38.988s-.137.725-.38.988c-.244.262-.575.41-.92.412a1.263 1.263 0 01-.92-.412A1.453 1.453 0 013.7 8c0-.37.137-.725.38-.988zM10 6.6c-.345.002-.676.15-.92.412-.243.263-.38.618-.38.988s.137.725.38.988c.244.262.575.41.92.412.345-.002.676-.15.92-.412.243-.263.38-.618.38-.988s-.137-.725-.38-.988a1.263 1.263 0 00-.92-.412z"
        fill="currentColor"
      />
    ) : variant === 'Google' ? (
      <path
        d="M13.8496 6.31772H7.65076V8.82851H11.2181C10.8861 10.424 9.4962 11.3408 7.65076 11.3408C7.13438 11.3416 6.6229 11.2428 6.14566 11.0501C5.66842 10.8573 5.23482 10.5744 4.86971 10.2175C4.50461 9.8606 4.21519 9.43677 4.01805 8.97031C3.82091 8.50385 3.71994 8.00395 3.72092 7.49927C3.72004 6.99465 3.82108 6.49483 4.01826 6.02846C4.21544 5.56208 4.50488 5.13834 4.86998 4.78152C5.23507 4.4247 5.66864 4.14183 6.14583 3.94912C6.62302 3.7564 7.13444 3.65765 7.65076 3.65851C8.588 3.65851 9.43516 3.98373 10.0999 4.51557L12.0355 2.62466C10.8563 1.6199 9.34434 1.00003 7.65076 1.00003C6.77666 0.997531 5.91068 1.16395 5.10262 1.48972C4.29456 1.81549 3.56037 2.29418 2.94229 2.89826C2.3242 3.50233 1.83441 4.21988 1.50108 5.00962C1.16776 5.79936 0.997476 6.64571 1.00003 7.5C0.997377 8.35431 1.16759 9.20071 1.50088 9.9905C1.83417 10.7803 2.32396 11.4979 2.94207 12.102C3.56017 12.7061 4.2944 13.1847 5.1025 13.5105C5.9106 13.8362 6.77663 14.0026 7.65076 14C10.9761 14 14 11.6361 14 7.5C14 7.11585 13.9397 6.70187 13.8496 6.31772Z"
        fill="currentColor"
      />
    ) : variant === 'Instagram' ? (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.91 12.909c.326-.327.582-.72.749-1.151.16-.414.27-.886.302-1.578.032-.693.04-.915.04-2.68 0-1.765-.008-1.987-.04-2.68-.032-.692-.142-1.164-.302-1.578a3.185 3.185 0 00-.75-1.151 3.187 3.187 0 00-1.151-.75c-.414-.16-.886-.27-1.578-.302C9.487 1.007 9.265 1 7.5 1c-1.765 0-1.987.007-2.68.04-.692.03-1.164.14-1.578.301-.433.163-.826.42-1.151.75-.33.325-.587.718-.75 1.151-.16.414-.27.886-.302 1.578C1.007 5.513 1 5.735 1 7.5c0 1.765.007 1.987.04 2.68.03.692.14 1.164.301 1.578.164.434.42.826.75 1.151.325.33.718.586 1.151.75.414.16.886.27 1.578.302.693.031.915.039 2.68.039 1.765 0 1.987-.008 2.68-.04.692-.03 1.164-.14 1.578-.301a3.323 3.323 0 001.151-.75zM2 6.735v1.53c-.002.821-.002 1.034.02 1.5.026.586.058 1.016.156 1.34.094.312.199.63.543 1.012.344.383.675.556 1.097.684.423.127.954.154 1.415.175.522.024.73.024 1.826.024H8.24c.842.001 1.054.002 1.526-.02.585-.027 1.015-.059 1.34-.156.311-.094.629-.2 1.011-.543.383-.344.556-.676.684-1.098.127-.422.155-.953.176-1.414C13 9.247 13 9.04 13 7.947v-.89c0-1.096 0-1.303-.023-1.826-.021-.461-.049-.992-.176-1.414-.127-.423-.3-.754-.684-1.098-.383-.344-.7-.449-1.011-.543-.325-.097-.755-.13-1.34-.156A27.29 27.29 0 008.24 2H7.057c-1.096 0-1.304 0-1.826.023-.461.021-.992.049-1.415.176-.422.128-.753.301-1.097.684-.344.383-.45.7-.543 1.012-.098.324-.13.754-.156 1.34-.022.466-.022.679-.02 1.5zM7.5 5.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM4.25 7.5a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zm6.72-2.72a.75.75 0 100-1.5.75.75 0 000 1.5z"
        fill="currentColor"
      />
    ) : variant === 'Twitch' ? (
      <path
        d="M4.68164 2L3 4.42876V11.4286H5.5V13H7L8.5 11.4286H10.5L13 8.80952V2H4.68164ZM5 3.04762H12V7.76191L10.5 9.33333H8L6.5 10.9048V9.33333H5V3.04762ZM7.5 4.61905V7.2381H8.5V4.61905H7.5ZM10 4.61905V7.2381H11V4.61905H10Z"
        fill="currentColor"
      />
    ) : variant === 'Tiktok' ? (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.772 2c.18 1.561 1.039 2.492 2.533 2.59v1.756c-.866.086-1.624-.201-2.506-.742v3.283c0 4.172-4.486 5.475-6.29 2.485-1.159-1.924-.45-5.3 3.269-5.435v1.851a5.32 5.32 0 00-.863.215c-.827.284-1.296.815-1.166 1.752.251 1.795 3.5 2.327 3.23-1.181v-6.57h1.793V2z"
        fill="currentColor"
      />
    ) : variant === 'YouTube' ? (
      <path
        d="M7.828 2c-2.106 0-4.084.156-5.137.375C1.99 2.53 1.383 3 1.255 3.719 1.128 4.469 1 5.594 1 7s.127 2.5.287 3.281c.128.687.734 1.188 1.435 1.344C3.84 11.844 5.753 12 7.86 12s4.02-.156 5.136-.375c.703-.156 1.309-.625 1.436-1.344.128-.781.288-1.905.319-3.312 0-1.406-.16-2.531-.319-3.313-.127-.687-.733-1.187-1.436-1.344C11.88 2.156 9.933 2 7.828 2zm0 .625c2.297 0 4.147.187 5.04.343.479.126.861.438.925.845.192 1 .319 2.063.319 3.156a22.57 22.57 0 01-.32 3.218c-.094.594-.732.782-.924.845-1.149.218-3.063.373-4.977.373s-3.86-.124-4.977-.373c-.478-.126-.86-.438-.924-.845-.256-.875-.352-2.031-.352-3.187 0-1.438.128-2.5.256-3.156.096-.594.765-.782.924-.844 1.053-.219 3-.375 5.01-.375zM6.105 4.5v5L10.57 7zm.638 1.063L9.295 7 6.743 8.437z"
        fill="currentColor"
      />
    ) : null}
  </svg>
)
