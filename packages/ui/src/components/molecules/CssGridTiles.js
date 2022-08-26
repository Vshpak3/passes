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
