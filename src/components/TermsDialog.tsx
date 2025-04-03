
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsDialog: React.FC<TermsDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-neon-purple" />
            Terms & Conditions
          </DialogTitle>
          <DialogDescription>
            Zero Defend Security Payment Gateway
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-1">1. Payment Terms</h3>
            <p className="text-muted-foreground text-xs">
              All payments made through this gateway are for educational courses offered by Zero Defend Security. 
              By proceeding with payment, you agree to the course terms and payment policies.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">2. Refund Policy</h3>
            <p className="text-muted-foreground text-xs">
              All sales are final. Refunds are provided only in exceptional circumstances and are subject to 
              approval by the Zero Defend Security team.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">3. Privacy Policy</h3>
            <p className="text-muted-foreground text-xs">
              Your personal information and payment details are secured with industry-standard encryption. 
              We do not store your payment method details on our servers.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">4. Course Access</h3>
            <p className="text-muted-foreground text-xs">
              Access to course content will be provided within 24 hours of payment verification. You will 
              receive credentials to the registered email address.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">5. Support</h3>
            <p className="text-muted-foreground text-xs">
              For payment-related issues, contact our support team at +91 80759 24249 (Mr. Kiran Singh).
              For course-related queries, use the support portal provided after enrollment.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">6. Intellectual Property</h3>
            <p className="text-muted-foreground text-xs">
              All course materials are protected by copyright and are for personal use only. Redistribution, 
              sharing, or reselling of course materials is strictly prohibited.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            I Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
