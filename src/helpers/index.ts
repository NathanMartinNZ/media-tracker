
const formatDate = (date:string) => {
  if(!date) { return }
  const d = new Date(date)
  return d.toLocaleDateString("en-uk", { year:"numeric", month:"short", day:"numeric"})
}

export { formatDate }