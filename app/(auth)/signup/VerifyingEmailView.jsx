'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

export default function VerifyingEmailView({signUp}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = async (newVal) => {
        setValue(newVal);
        setError(null);

        if (newVal.length === 6) {
            setIsLoading(true);
            try {
                await signUp.attemptEmailAddressVerification({code: newVal});
                router.push('/dashboard');
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred during verification."
                );
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleResendVerification = async () => {
        try {
            await signUp.prepareEmailAddressVerification();
            alert("Verification email resent. Please check your inbox.");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to resend verification email."
            );
        }
    }

    return (
        <div
            className="relative h-screen w-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center overflow-hidden">
            {/* Background gradient stripes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="absolute top-0 left-0 w-[15%] transform -rotate-45 origin-top-left"
                        style={{
                            left: `${index * 80}px`,
                            backgroundColor: `rgba(99, 80, 250, ${0.1 * (index + 1)})`,
                            height: '200vh'
                        }}
                    />
                ))}
            </div>

            <div className="text-center relative z-10 w-full max-w-md mx-auto px-6">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <h1 className="text-4xl font-extrabold text-violet-800 mb-4">
                        Verify Email
                    </h1>

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Verification Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="text-xl text-gray-600 font-medium mb-6">
                        Please check your email to complete the verification process.
                    </div>

                    <InputOTP
                        className="flex justify-center mb-6"
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={value}
                        onChange={handleChange}
                        disabled={isLoading}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <div className="mt-6 flex justify-center">
                        <div className="w-16 h-1 bg-violet-500 rounded-full"></div>
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        Didn&#39;t receive an email?
                        <Button
                            variant="link"
                            className="text-violet-600 ml-1"
                            onClick={handleResendVerification}
                            disabled={isLoading}
                        >
                            Resend verification
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
}