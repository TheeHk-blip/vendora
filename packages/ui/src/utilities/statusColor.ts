export const STATUS_COLORS: Record<string, string> = {
  live: "bg-green-500/10 text-green-600",
  pending: "bg-yellow-400/10 text-orange-600",
  rejected: "bg-red-500/20 text-red-600",
  awaitingDispatch: "ring text-yellow-600",
  inTransit: "ring text-blue-600",
  delivered: "ring text-green-600"
}