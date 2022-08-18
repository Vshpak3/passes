import { CssTile } from "../atoms"

export const GridTile = () => {
  return (
    <div className="grid grid-cols-3 gap-[45px]">
      <CssTile fill={true} />
      <CssTile fill />
      <CssTile />
      <CssTile />
      <CssTile fill />
      <CssTile fill />
      <CssTile />
      <CssTile fill />
      <CssTile fill />
      <CssTile fill />
      <CssTile fill />
      <CssTile />
    </div>
  )
}

export const GridTileSm = () => {
  return (
    <div className="fixed -bottom-12 -left-28 flex flex-col gap-[45px] lg:hidden">
      <div className="flex flex-row gap-[45px]">
        <CssTile fill />
        <CssTile fill />
        <CssTile />
        <CssTile fill />
        <CssTile fill />
        <CssTile />
        <CssTile fill />
      </div>
      <div className="flex flex-row gap-[45px]">
        <CssTile />
        <CssTile fill />
        <CssTile fill />
        <CssTile />
        <CssTile fill />
        <CssTile fill />
        <CssTile />
      </div>
    </div>
  )
}
