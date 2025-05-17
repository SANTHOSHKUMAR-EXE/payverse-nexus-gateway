
import PaymentGateway from "@/components/PaymentGateway";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader, QrCode } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [txnId, setTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDesktopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !txnId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (txnId.length < 8) {
      toast.error("Please enter a valid transaction ID (min 8 characters)");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Google Form submission URL
      const googleFormURL = `https://docs.google.com/forms/d/e/1FAIpQLSdT90vozennnozOGeGeJ0TgfKNnRnnvwBVfiEQTzKpPn-f87w/formResponse?usp=pp_url&entry.913204754=${encodeURIComponent(name)}&entry.1327490220=${encodeURIComponent("")}&entry.1829641072=${encodeURIComponent("+91"+phone)}&entry.1953753319=${encodeURIComponent("Android Security & Hacking")}&entry.1832110819=${encodeURIComponent(txnId)}`;
      
      // Submit form using fetch with no-cors mode
      await fetch(googleFormURL, {
        method: "POST",
        mode: "no-cors",
      });
      
      // Show success message
      toast.success("Payment recorded! Verification pending...");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to record payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center mb-2">
                <img 
                  src="https://learn.zerodefendsecurity.com/logo.png" 
                  alt="Zero Defend Security" 
                  className="h-8 w-8 mr-2" 
                />
                <CardTitle className="text-xl bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                  Zero Defend Security Payment
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Scan the QR code below to make a payment, then submit your details
              </p>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="border-2 border-muted p-2 rounded-lg mb-2">
                      <img 
                        src="https://learn.zerodefendsecurity.com/QrCode.png" 
                        alt="Payment QR Code" 
                        className="w-full max-w-[250px] h-auto" 
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Scan with any UPI app to pay ₹8,999
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <form onSubmit={handleDesktopSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit phone number"
                          type="tel"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="txnId">Transaction ID</Label>
                        <Input 
                          id="txnId" 
                          value={txnId} 
                          onChange={(e) => setTxnId(e.target.value)}
                          placeholder="Enter UPI Transaction ID"
                        />
                        <p className="text-xs text-muted-foreground">
                          Find this in your UPI payment history
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Submit Payment</span>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Payment Under Verification</h3>
                  <p className="text-muted-foreground">
                    Your payment for Android Security & Hacking is being verified.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    You will receive a confirmation soon.
                  </p>
                  
                  <Button 
                    className="mt-6"
                    onClick={() => {
                      setName("");
                      setPhone("");
                      setTxnId("");
                      setIsSubmitted(false);
                    }}
                  >
                    Submit Another Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
      <PaymentGateway />
    </>
  );
};

export default Index;
