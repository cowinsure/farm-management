// API Configuration and Types
export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/public`

export interface ApiResponse<T = any> {
  statusCode: string
  statusMessage: string
  data: {
    message: string
    results?: T[]
    details?: any
  }
}

export interface SignupRequest {
  mobile_number: string
  role_id: string
  latitude: number
  longitude: number
}

export interface OtpVerificationRequest {
  mobile_number: string
  otp: string
}

export interface SetPasswordRequest {
  mobile_number: string
  password: string
}

export interface LoginRequest {
  mobile_number: string
  password: string
}

export interface LoginResponse {
  message: string
  role: string
  access_token: string
  refresh_token: string
  is_insurecow_agent: boolean
  is_insurance_agent: boolean
  is_enterprise_agent: boolean
  is_superuser: boolean
}

export interface User {
  role: string
  access_token: string
  refresh_token: string
  is_insurecow_agent: boolean
  is_insurance_agent: boolean
  is_enterprise_agent: boolean
  is_superuser: boolean
}

// API Error Types
export class ApiError extends Error {
  constructor(
    public statusCode: string,
    public statusMessage: string,
    public details?: any,
  ) {
    super(statusMessage)
    this.name = "ApiError"
  }
}

// Token Management Service
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = "access_token"
  private static readonly REFRESH_TOKEN_KEY = "refresh_token"
  private static readonly USER_DATA_KEY = "user_data"

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }
    return null
  }

  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  static setUserData(userData: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData))
    }
  }

  static getUserData(): User | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(this.USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  static clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_DATA_KEY)
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

// HTTP Client Service
class HttpClient {
  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      // Add authorization header if token exists
      const token = TokenManager.getAccessToken()
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      if (token) {
        headers['authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data: ApiResponse<T> = await response.json()

      if (data.statusCode !== "200") {
        throw new ApiError(data.statusCode, data.statusMessage, data.data)
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("500", "Network error occurred", { message: "Failed to connect to server" })
    }
  }

  async post<T>(url: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "GET",
    })
  }

  async put<T>(url: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "DELETE",
    })
  }
}

// Auth Service Implementation
export class AuthService {
  private httpClient = new HttpClient()

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(`${API_BASE_URL}/login/`, data)
  }

  async registerStep1(data: SignupRequest): Promise<ApiResponse> {
    return this.httpClient.post(`${API_BASE_URL}/register/step1/`, data)
  }

  async verifyOtp(data: OtpVerificationRequest): Promise<ApiResponse> {
    return this.httpClient.post(`${API_BASE_URL}/register/verify-otp/`, data)
  }

  async setPassword(data: SetPasswordRequest): Promise<ApiResponse> {
    return this.httpClient.post(`${API_BASE_URL}/register/set-password/`, data)
  }

  // Token management methods
  saveAuthData(loginResponse: LoginResponse): void {
    TokenManager.setTokens(loginResponse.access_token, loginResponse.refresh_token)
    TokenManager.setUserData({
      role: loginResponse.role,
      access_token: loginResponse.access_token,
      refresh_token: loginResponse.refresh_token,
      is_insurecow_agent: loginResponse.is_insurecow_agent,
      is_insurance_agent: loginResponse.is_insurance_agent,
      is_enterprise_agent: loginResponse.is_enterprise_agent,
      is_superuser: loginResponse.is_superuser,
    })
  }

  logout(): void {
    TokenManager.clearTokens()
  }

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated()
  }

  getCurrentUser(): User | null {
    return TokenManager.getUserData()
  }
}

// Singleton instance
export const authService = new AuthService()

export { TokenManager }
