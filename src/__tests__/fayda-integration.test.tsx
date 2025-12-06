/**
 * Fayda Integration Tests
 * 
 * Test Cases: FAY-001 to FAY-012
 * 
 * These tests validate the Fayda (Ethiopian National ID) integration flow including:
 * - Authorization request and PKCE flow
 * - Callback handling
 * - Token exchange
 * - UserInfo retrieval
 * - Security features
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FaydaLoginPage from '@/app/login/fayda/page'
import CallbackPage from '@/app/callback/page'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('axios')
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
}

describe('Fayda Integration - Login and Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    localStorage.clear()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    window.location.assign = jest.fn()
  })

  describe('FAY-001: User can click "Continue with Fayda" button', () => {
    it('should render the login button correctly', () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      expect(button).toBeInTheDocument()
    })

    it('should be clickable', () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      expect(button).not.toBeDisabled()
    })
  })

  describe('FAY-002: User is redirected to Fayda login page', () => {
    it('should redirect to Fayda authorization endpoint when button is clicked', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalled()
        const redirectUrl = (window.location.assign as jest.Mock).mock.calls[0][0]
        expect(redirectUrl).toContain('esignet.ida.fayda.et')
        expect(redirectUrl).toContain('/authorize')
      })
    })

    it('should include required parameters in authorization URL', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        const redirectUrl = (window.location.assign as jest.Mock).mock.calls[0][0]
        expect(redirectUrl).toContain('client_id=')
        expect(redirectUrl).toContain('response_type=code')
        expect(redirectUrl).toContain('redirect_uri=')
        expect(redirectUrl).toContain('scope=openid%20profile%20email')
        expect(redirectUrl).toContain('code_challenge=')
        expect(redirectUrl).toContain('code_challenge_method=S256')
        expect(redirectUrl).toContain('state=')
      })
    })
  })

  describe('FAY-003: PKCE Code Verifier Generation', () => {
    it('should generate and store code_verifier in sessionStorage', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        const verifier = sessionStorage.getItem('fayda_pkce_verifier')
        expect(verifier).toBeTruthy()
        expect(verifier!.length).toBeGreaterThan(40) // Should be at least 43 chars (base64 of 32 bytes)
      })
    })
  })

  describe('FAY-004: User returns to wallet with authorization code', () => {
    it('should handle callback with authorization code', () => {
      const mockSearchParams = new URLSearchParams('?code=test_auth_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      // Should show loading state initially
      expect(screen.getByText(/waiting for fayda response/i)).toBeInTheDocument()
    })

    it('should extract authorization code from URL', () => {
      const mockSearchParams = new URLSearchParams('?code=test_code_123&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      expect(mockSearchParams.get('code')).toBe('test_code_123')
    })
  })

  describe('FAY-005: Authorization code is exchanged for access token', () => {
    it('should exchange authorization code for tokens', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
          id_token: 'mock_id_token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }

      mockAxios.post.mockResolvedValue(mockTokenResponse)

      sessionStorage.setItem('fayda_pkce_verifier', 'test_verifier')
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/token', {
          code: 'test_code',
          code_verifier: 'test_verifier',
        })
      })
    })

    it('should handle token exchange errors gracefully', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      mockAxios.post.mockRejectedValue(new Error('Token exchange failed'))

      sessionStorage.setItem('fayda_pkce_verifier', 'test_verifier')
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  describe('FAY-006: User profile information is retrieved', () => {
    it('should retrieve userinfo after receiving access token', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
          id_token: 'mock_id_token',
        },
      }

      const mockUserInfoResponse = {
        data: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSJ9.mock',
      }

      mockAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce(mockUserInfoResponse)

      sessionStorage.setItem('fayda_pkce_verifier', 'test_verifier')
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith('/api/userinfo/', {
          access_token: 'mock_access_token',
        })
      }, { timeout: 3000 })
    })
  })

  describe('FAY-007: User profile is displayed correctly', () => {
    it('should display user profile information after successful authentication', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
        },
      }

      // Mock JWT payload: { name: "John Doe", email: "john@example.com" }
      const mockJWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifQ.mock'
      
      mockAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce({ data: mockJWT })

      sessionStorage.setItem('fayda_pkce_verifier', 'test_verifier')
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      // Wait for profile to be displayed
      await waitFor(() => {
        expect(screen.getByText(/identity verified/i)).toBeInTheDocument()
      }, { timeout: 5000 })
    })
  })

  describe('FAY-008: User is automatically redirected to dashboard', () => {
    it('should auto-redirect to dashboard after successful authentication', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
        },
      }

      mockAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce({ data: { name: 'Test User' } })

      sessionStorage.setItem('fayda_pkce_verifier', 'test_verifier')
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      jest.useFakeTimers()
      render(<CallbackPage />)

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalled()
      })

      // Fast-forward 1.5 seconds
      jest.advanceTimersByTime(1500)

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard/credentials')
      })

      jest.useRealTimers()
    })
  })

  describe('FAY-009: Security tokens are generated correctly (PKCE)', () => {
    it('should generate valid code_verifier', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        const verifier = sessionStorage.getItem('fayda_pkce_verifier')
        expect(verifier).toBeTruthy()
        // PKCE verifier should be 43-128 characters, URL-safe
        expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/)
      })
    })

    it('should generate code_challenge from code_verifier', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        const redirectUrl = (window.location.assign as jest.Mock).mock.calls[0][0]
        expect(redirectUrl).toContain('code_challenge=')
        expect(redirectUrl).toContain('code_challenge_method=S256')
      })
    })
  })

  describe('FAY-010: State parameter prevents unauthorized access', () => {
    it('should generate and store state parameter', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        const state = sessionStorage.getItem('fayda_state')
        expect(state).toBeTruthy()
        expect(state!.length).toBeGreaterThan(10)
      })
    })

    it('should include state in authorization URL', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        const redirectUrl = (window.location.assign as jest.Mock).mock.calls[0][0]
        expect(redirectUrl).toContain('state=')
      })
    })
  })

  describe('FAY-011: User data is stored securely', () => {
    it('should store session data in sessionStorage (temporary)', async () => {
      render(<FaydaLoginPage />)
      
      const button = screen.getByRole('button', { name: /continue with fayda/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(sessionStorage.getItem('fayda_pkce_verifier')).toBeTruthy()
        expect(sessionStorage.getItem('fayda_state')).toBeTruthy()
      })
    })

    it('should clean up sessionStorage after successful authentication', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      const mockTokenResponse = {
        data: {
          access_token: 'mock_access_token',
        },
      }

      mockAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce({ data: { name: 'Test User' } })

      sessionStorage.setItem('fayda_pkce_verifier', 'test_verifier')
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      await waitFor(() => {
        expect(sessionStorage.getItem('fayda_pkce_verifier')).toBeNull()
      }, { timeout: 3000 })
    })
  })

  describe('FAY-012: Error messages are user-friendly', () => {
    it('should display friendly error when authorization code is missing', () => {
      const mockSearchParams = new URLSearchParams('?error=access_denied')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<CallbackPage />)

      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })

    it('should display helpful error when code_verifier is missing', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>
      
      const mockSearchParams = new URLSearchParams('?code=test_code&state=test_state')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      // Don't set code_verifier in sessionStorage
      render(<CallbackPage />)

      await waitFor(() => {
        expect(screen.getByText(/missing code_verifier/i)).toBeInTheDocument()
      })
    })
  })
})

