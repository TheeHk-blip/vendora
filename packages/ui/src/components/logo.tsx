
type Props = {
  width: number;
  height: number;
}

export function Logo({width, height}: Props) {
  return(
    <img src="/brand.png" alt="Logo" width={width} height={height} />
  )
}