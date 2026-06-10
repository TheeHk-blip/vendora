
type Props = {
  width: number;
  height: number;
  className?: string;
}

export function Logo({width, height, className}: Props) {
  return(
    <img src="/brand.png" alt="Logo" width={width} height={height} fetchPriority="low" className={className} />
  )
}