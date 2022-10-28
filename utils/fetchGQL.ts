import { request } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_API

type ReturnType<T> =
  | {
      data: T
      error: null
    }
  | {
      data: null
      error: any
    }

const fetchGQL = async <T>(query: string): Promise<ReturnType<T>> => {
  try {
    const data = await request<T>(endpoint, query)
    return {
      data: data,
      error: null
    }
  } catch (error) {
    console.debug(error)
    return {
      data: null,
      error: error
    }
  }
}

export default fetchGQL
