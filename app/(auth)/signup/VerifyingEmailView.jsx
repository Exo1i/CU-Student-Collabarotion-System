'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";
import {useAlert} from "@/components/alert-context";

export default function VerifyingEmailView({signUp, setActive}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {showAlert} = useAlert()
    const handleChange = async (newVal) => {
        setValue(newVal);
        setError(null);

        if (newVal.length === 6) {
            setIsLoading(true);
            try {
                await signUp.attemptEmailAddressVerification({code: newVal});
                await setActive({session: signUp.createdSessionId});
                router.push('/onboarding');
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to verify email"
                );
                showAlert({
                    message: error instanceof Error ? error.message : "Failed to verify email",
                    severity: "error",
                });
            } finally {
                setIsLoading(false);
            }
        }
    }
    const handleResendVerification = async () => {
        try {
            await signUp.prepareEmailAddressVerification();
            showAlert({
                message: "Verification email sent successfully",
                severity: "success",
            });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to resend otp"
            );
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
            {/* @TODO: TASNEEM, add an image Here -Yn*/}
            <div className="w-full max-w-md px-6">
                <div className="m-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-violet-800 mb-4">
                            Verify Email
                        </h1>

                        <p className="text-xl text-gray-600 font-medium mb-6">
                            Please check your email to complete the verification process.
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Verification Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={value}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <InputOTPGroup className="space-x-2">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-1 bg-violet-500 rounded-full mx-auto my-4"></div>

                        <p className="text-sm text-gray-500">
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
        </div>
    );
}