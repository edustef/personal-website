import apiUrl from 'constants/apiUrl'

export function getStrapiMedia(url: string) {
  const imageUrl = url.startsWith('/') ? `${apiUrl}${url}` : url
  return imageUrl
}
