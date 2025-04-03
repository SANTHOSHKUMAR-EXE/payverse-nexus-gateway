
import PaymentGateway from "@/components/PaymentGateway";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Monitor, Shield } from "lucide-react";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md w-full animate-pulse">
            <Monitor className="h-6 w-6 mr-2" />
            <AlertTitle className="text-xl">Mobile Device Required</AlertTitle>
            <AlertDescription className="mt-2">
              Zero Defend Security Payment Gateway is designed for mobile devices only. 
              Please open this link on your smartphone to proceed with the payment.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <PaymentGateway />
    </>
  );
};

export default Index;
