"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Logo } from "@/components/logo"

export default function Verify() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [verified, setVerified] = useState(false)
  const [verificationId, setVerificationId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // If no user is logged in, redirect to sign in
    if (!authLoading && !user) {
      router.push("/signin")
      return
    }

    // If user doesn't have a wallet, redirect to connect wallet
    if (!authLoading && user && !user.walletAddress) {
      router.push("/connect-wallet")
    }
  }, [authLoading, user, router])

  const handleSimulateVerify = async () => {
    setIsVerifying(true)
    setError("")

    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call your API to simulate verification
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merkle_root: "simulated_merkle_root",
          nullifier_hash: "simulated_nullifier_hash",
          proof: "simulated_proof",
          credential_type: "orb",
          address: user?.walletAddress,
        }),
      })

      const data = await response.json()
      console.log("API response:", data)

      if (response.ok && data.success) {
        setVerified(true)
        setVerificationId(data.id || "verified")
      } else {
        setError(data.error || "Verification failed. Please try again.")
      }
    } catch (error: any) {
      console.error("❌ Verification error:", error)
      setError(error.message || "Verification failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  if (authLoading) {
    return (
      <div className="container max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="container max-w-md mx-auto p-4 min-h-screen flex flex-col justify-center">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center">
          <Logo size="md" className="mb-4" />
          <CardTitle className="text-2xl text-center">Verify Your Identity</CardTitle>
          <CardDescription className="text-center">
            Verify your identity to interact with the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temporary notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> World ID integration is temporarily disabled. Using simulation for now.
            </AlertDescription>
          </Alert>

          {verified ? (
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium">Verification Successful!</h3>
                <p className="text-sm text-gray-500 mt-1">Your identity has been verified</p>
                <p className="text-xs bg-gray-100 p-2 rounded mt-2 font-mono">ID: {verificationId}</p>
              </div>
              <Button onClick={handleContinue} className="mt-4">
                Continue to Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 py-6">
              <p className="text-center text-gray-600">
                You need to verify your identity before you can use the app. This helps ensure security and prevents
                fraud.
              </p>

              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mt-4 w-full">
                <Button
                  size="lg"
                  onClick={handleSimulateVerify}
                  className="bg-[#3C9AAA] hover:bg-[#2D7A8A] text-white w-full"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM16 10.5C13.0147 10.5 10.5 13.0147 10.5 16C10.5 18.9853 13.0147 21.5 16 21.5C18.9853 21.5 21.5 18.9853 21.5 16C21.5 13.0147 18.9853 10.5 16 10.5Z"
                          fill="white"
                        />
                      </svg>
                      Simulate Identity Verification
                    </>
                  )}
                </Button>
              </div>

              <Button variant="outline" className="mt-2 w-full" onClick={() => router.push("/dashboard")}>
                Skip for Now
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Identity verification helps ensure security and prevents fraud
        </CardFooter>
      </Card>
    </main>
  )
}
