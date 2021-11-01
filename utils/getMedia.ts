import apiUrl from 'constants/apiUrl'

export function getMedia(url: string) {
  const imageUrl = url.startsWith('/') ? `${apiUrl}${url}` : url
  return imageUrl
}
