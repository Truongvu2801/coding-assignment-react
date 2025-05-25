const API_BASE_URL = 'http://localhost:4200/api'

export async function apiBase<T>(
  endpoint: string,
  {
    method = 'GET',
    body,
    params
  }: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: any
    params?: Record<string, string | number | boolean | undefined>
  } = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  }

  const response = await fetch(url.toString(), config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }

  if (response.status === 204) {
    return undefined as unknown as T
  }

  return response.json()
}
