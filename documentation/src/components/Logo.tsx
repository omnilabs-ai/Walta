export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" viewBox="0 0 200 40" fill="none">
      <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z" fill="#34D399"/>
      <path d="M15 20L20 15L25 20L20 25L15 20Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="44" y="26" font-family="Arial" font-weight="bold" font-size="18" fill="#34D399">Walta</text>
    </svg>
  )
}
