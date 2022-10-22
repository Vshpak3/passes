export const queryParam = (
  param: string | string[] | undefined
): string | undefined => (Array.isArray(param) ? param[0] : param)
