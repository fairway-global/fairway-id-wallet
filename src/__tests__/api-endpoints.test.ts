/**
 * API Endpoint Tests
 * 
 * Test Cases: API-001 to API-004
 * 
 * These tests validate the API endpoints for token exchange and userinfo retrieval
 */

import { POST } from '@/app/api/token/route'
import { POST as POSTUserInfo } from '@/app/api/userinfo/route'
import axios from 'axios'
import { generateSignedJwt } from '@/utils/jwtGenerator'

jest.mock('axios')
jest.mock('@/utils/jwtGenerator')

const mockAxios = axios as jest.Mocked<typeof axios>
const mockGenerateSignedJwt = generateSignedJwt as jest.MockedFunction<typeof generateSignedJwt>

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up default environment variables
    process.env.NEXT_APP_REDIRECT_URI = 'http://localhost:3000/callback'
    process.env.NEXT_APP_CLIENT_ID = 'test_client_id'
    process.env.NEXT_APP_TOKEN_ENDPOINT = 'https://esignet.ida.fayda.et/token'
    process.env.NEXT_APP_USERINFO_ENDPOINT = 'https://esignet.ida.fayda.et/userinfo'
  })

  describe('API-001: Token exchange endpoint works', () => {
    it('should successfully exchange authorization code for tokens', async () => {
      const mockJWT = 'mock_signed_jwt_token'
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
          id_token: 'mock_id_token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }

      mockGenerateSignedJwt.mockResolvedValue(mockJWT)
      mockAxios.post.mockResolvedValue(mockTokenResponse)

      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code: 'test_authorization_code',
          code_verifier: 'test_code_verifier',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('access_token')
      expect(data).toHaveProperty('id_token')
      expect(mockAxios.post).toHaveBeenCalledWith(
        process.env.NEXT_APP_TOKEN_ENDPOINT,
        expect.stringContaining('grant_type=authorization_code'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      )
    })

    it('should include all required parameters in token request', async () => {
      const mockJWT = 'mock_signed_jwt_token'
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
          id_token: 'mock_id_token',
        },
      }

      mockGenerateSignedJwt.mockResolvedValue(mockJWT)
      mockAxios.post.mockResolvedValue(mockTokenResponse)

      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code: 'test_code',
          code_verifier: 'test_verifier',
        }),
      })

      await POST(request)

      const callArgs = mockAxios.post.mock.calls[0]
      const requestBody = callArgs[1] as string

      expect(requestBody).toContain('grant_type=authorization_code')
      expect(requestBody).toContain('code=test_code')
      expect(requestBody).toContain('code_verifier=test_verifier')
      expect(requestBody).toContain('client_assertion=')
      expect(requestBody).toContain('client_assertion_type=')
    })
  })

  describe('API-002: UserInfo endpoint returns data', () => {
    it('should successfully retrieve userinfo with valid access token', async () => {
      const mockUserInfoJWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock_userinfo_jwt'
      
      mockAxios.get.mockResolvedValue({
        data: mockUserInfoJWT,
      })

      const request = new Request('http://localhost/api/userinfo', {
        method: 'POST',
        body: JSON.stringify({
          access_token: 'valid_access_token',
        }),
      })

      const response = await POSTUserInfo(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toBe(mockUserInfoJWT)
      expect(mockAxios.get).toHaveBeenCalledWith(
        process.env.NEXT_APP_USERINFO_ENDPOINT,
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer valid_access_token',
          },
        })
      )
    })

    it('should include Authorization header with Bearer token', async () => {
      const mockUserInfoJWT = 'mock_userinfo_jwt'
      
      mockAxios.get.mockResolvedValue({
        data: mockUserInfoJWT,
      })

      const request = new Request('http://localhost/api/userinfo', {
        method: 'POST',
        body: JSON.stringify({
          access_token: 'test_token',
        }),
      })

      await POSTUserInfo(request)

      expect(mockAxios.get).toHaveBeenCalledWith(
        process.env.NEXT_APP_USERINFO_ENDPOINT,
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test_token',
          },
        })
      )
    })
  })

  describe('API-003: Error handling works correctly', () => {
    it('should return 400 error when authorization code is missing', async () => {
      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code_verifier: 'test_verifier',
          // Missing code
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Missing code')
    })

    it('should return 400 error when code_verifier is missing', async () => {
      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code: 'test_code',
          // Missing code_verifier
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Missing code_verifier')
    })

    it('should return 500 error when environment variables are missing', async () => {
      delete process.env.NEXT_APP_TOKEN_ENDPOINT

      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code: 'test_code',
          code_verifier: 'test_verifier',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error', 'Configuration error')
      expect(data).toHaveProperty('error_description')
    })

    it('should return 400 error when access_token is missing for userinfo', async () => {
      const request = new Request('http://localhost/api/userinfo', {
        method: 'POST',
        body: JSON.stringify({
          // Missing access_token
        }),
      })

      const response = await POSTUserInfo(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Missing access token')
    })

    it('should handle token exchange errors from Fayda', async () => {
      const mockJWT = 'mock_signed_jwt_token'
      
      mockGenerateSignedJwt.mockResolvedValue(mockJWT)
      mockAxios.post.mockRejectedValue({
        response: {
          status: 400,
          data: {
            error: 'invalid_request',
            error_description: 'The authorization code is invalid.',
          },
        },
      })

      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code: 'invalid_code',
          code_verifier: 'test_verifier',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'invalid_request')
      expect(data).toHaveProperty('error_description')
    })

    it('should handle invalid_transaction error', async () => {
      const mockJWT = 'mock_signed_jwt_token'
      
      mockGenerateSignedJwt.mockResolvedValue(mockJWT)
      mockAxios.post.mockRejectedValue({
        response: {
          status: 409,
          data: {
            error: 'invalid_transaction',
            error_description: 'invalid_transaction',
          },
        },
      })

      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({
          code: 'test_code',
          code_verifier: 'test_verifier',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data).toHaveProperty('error', 'invalid_transaction')
    })
  })

  describe('API-004: Missing data is handled gracefully', () => {
    it('should validate request payload structure', async () => {
      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
    })

    it('should handle malformed JSON requests', async () => {
      const request = new Request('http://localhost/api/token', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Request will fail to parse, but should be handled
      await expect(POST(request)).resolves.toBeDefined()
    })

    it('should return error when userinfo endpoint is not configured', async () => {
      delete process.env.NEXT_APP_USERINFO_ENDPOINT

      const request = new Request('http://localhost/api/userinfo', {
        method: 'POST',
        body: JSON.stringify({
          access_token: 'test_token',
        }),
      })

      const response = await POSTUserInfo(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error', 'Configuration error')
      expect(data.error_description).toContain('NEXT_APP_USERINFO_ENDPOINT')
    })

    it('should handle userinfo API errors gracefully', async () => {
      mockAxios.get.mockRejectedValue({
        response: {
          status: 401,
          data: {
            error: 'invalid_token',
            error_description: 'The access token is invalid.',
          },
        },
      })

      const request = new Request('http://localhost/api/userinfo', {
        method: 'POST',
        body: JSON.stringify({
          access_token: 'invalid_token',
        }),
      })

      const response = await POSTUserInfo(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error', 'Userinfo request failed')
    })
  })
})

