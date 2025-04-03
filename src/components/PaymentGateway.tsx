
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle,
  CircleDot,
  Loader,
  MoveRight,
  Shield,
  Zap,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type PaymentStep = "details" | "payment" | "confirm";

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  price: number;
  txnId: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  course: "Android Security & Hacking",
  price: 4999,
  txnId: "",
};

const PaymentGateway: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("details");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentClicked, setPaymentClicked] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(10);
  const [showPayButton, setShowPayButton] = useState(false);

  const progressMap = {
    details: 33,
    payment: 66,
    confirm: 100,
  };

  useEffect(() => {
    let timer: number | undefined;
    if (paymentInitiated && paymentCountdown > 0) {
      timer = window.setTimeout(() => {
        setPaymentCountdown((prev) => prev - 1);
      }, 1000);
    } else if (paymentInitiated && paymentCountdown === 0) {
      setShowPayButton(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [paymentInitiated, paymentCountdown]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
    
    if (!name.trim()) {
      toast.error("❌ Please fill in all fields.");
      return false;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("❌ Invalid email format.");
      return false;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      toast.error("❌ Enter a valid 10-digit phone number.");
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === "details") {
      if (!validateForm()) return;
      setCurrentStep("payment");
    }
  };

  const initiateUpiPayment = () => {
    if (!validateForm()) return;
    
    const { name, email, phone, course, price } = formData;
    
    // UPI payment details
    const upiId = "kiransinghpay@axl";
    const note = `Payment from ${name}, ${email}, ${phone}, Course: ${course}`;
    
    // Generate UPI URL
    const upiURL = `upi://pay?pa=${upiId}&pn=Kiran%20Singh&tn=${encodeURIComponent(note)}&am=${price}&cu=INR`;
    
    // Open UPI payment app
    window.location.href = upiURL;
    
    // Set payment initiated flag and start countdown
    setPaymentInitiated(true);
    setPaymentCountdown(10);
    setShowPayButton(false);
    
    // Move to confirmation step
    setCurrentStep("confirm");
  };

  const paymentDone = () => {
    if (!validateForm()) return;
    
    if (paymentClicked) {
      toast.error("❌ Already submitted. Please wait.");
      return;
    }
    
    setPaymentClicked(true);
  };

  const submitPaymentConfirmation = async () => {
    const { txnId } = formData;
    
    if (!txnId || txnId.length < 8) {
      toast.error("❌ Enter a valid Transaction ID (min 8 characters).");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const { name, email, phone, course } = formData;
      
      // Google Form submission URL
      const googleFormURL = `https://docs.google.com/forms/d/e/1FAIpQLSdT90vozennnozOGeGeJ0TgfKNnRnnvwBVfiEQTzKpPn-f87w/formResponse?usp=pp_url&entry.913204754=${encodeURIComponent(name)}&entry.1327490220=${encodeURIComponent(email)}&entry.1829641072=${encodeURIComponent(phone)}&entry.1953753319=${encodeURIComponent(course)}&entry.1832110819=${encodeURIComponent(txnId)}`;
      
      // Submit form using fetch with no-cors mode
      await fetch(googleFormURL, {
        method: "POST",
        mode: "no-cors",
      });
      
      // Show success message
      toast.success("✅ Payment Recorded! Verification Pending...");
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to record payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep("details");
    setIsCompleted(false);
    setPaymentClicked(false);
    setPaymentInitiated(false);
    setPaymentCountdown(10);
    setShowPayButton(false);
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden glass-card bg-card shadow-xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              PayVerse Nexus Gateway
            </h2>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-neon-purple" />
              <span className="text-xs text-muted-foreground">Secure Payment</span>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep === "details" ? "1" : currentStep === "payment" ? "2" : "3"} of 3
              </span>
              <span className="text-xs font-medium text-neon-blue">
                {progressMap[currentStep]}%
              </span>
            </div>
            <Progress value={progressMap[currentStep]} className="h-1" />
            <div className="flex justify-between mt-1 mb-4">
              <span className="flex items-center space-x-1">
                <CircleDot size={12} className={currentStep === "details" ? "text-neon-purple" : "text-muted-foreground"} />
                <span className="text-xs">Details</span>
              </span>
              <span className="flex items-center space-x-1">
                <CircleDot size={12} className={currentStep === "payment" ? "text-neon-purple" : "text-muted-foreground"} />
                <span className="text-xs">Payment</span>
              </span>
              <span className="flex items-center space-x-1">
                <CircleDot size={12} className={currentStep === "confirm" ? "text-neon-purple" : "text-muted-foreground"} />
                <span className="text-xs">Confirm</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Course Details</h3>
                      <span className="px-2 py-1 bg-muted text-xs rounded-full flex items-center">
                        <Zap className="mr-1 h-3 w-3 text-neon-blue" />
                        Premium
                      </span>
                    </div>
                    <div className="p-4 border border-border rounded-lg mb-4 bg-muted/30">
                      <p className="text-lg font-medium">{formData.course}</p>
                      <p className="text-2xl font-bold text-neon-blue mt-1">
                        ₹{formData.price}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        className="neo-input w-full"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="neo-input w-full"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="10-digit mobile number"
                        className="neo-input w-full"
                        value={formData.phone}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="neo-button w-full mt-6 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <MoveRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {currentStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-medium">UPI Payment</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Complete payment using any UPI app
                    </p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="inline-flex gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" 
                           alt="UPI" 
                           className="h-8" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Pay_%28GPay%29_Logo_%282018-2020%29.svg" 
                           alt="Google Pay" 
                           className="h-8" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" 
                           alt="Paytm" 
                           className="h-8" />
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg mb-6 bg-muted/30">
                    <div className="flex justify-between mb-3">
                      <span className="text-muted-foreground">Payment to</span>
                      <span className="font-medium">Kiran Singh</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-muted-foreground">UPI ID</span>
                      <span className="font-medium">kiransinghpay@axl</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-neon-blue">₹{formData.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={initiateUpiPayment}
                    className="neo-button w-full mb-4 animate-pulse-glow"
                  >
                    Pay ₹{formData.price} via UPI
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep("details")}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Go Back
                  </button>
                </motion.div>
              )}

              {currentStep === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {!isCompleted ? (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-medium">Confirm Payment</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          Enter the transaction ID to complete
                        </p>
                      </div>

                      {paymentInitiated && !paymentClicked ? (
                        <div className="text-center mb-6">
                          {!showPayButton ? (
                            <div className="flex flex-col items-center justify-center space-y-4">
                              <div className="flex items-center justify-center space-x-2">
                                <Clock className="h-5 w-5 text-neon-purple animate-pulse" />
                                <p>Please wait while we process your payment...</p>
                              </div>
                              <div className="w-full bg-muted/40 rounded-full h-2.5">
                                <div 
                                  className="bg-neon-purple h-2.5 rounded-full" 
                                  style={{ width: `${((10-paymentCountdown)/10)*100}%` }}
                                ></div>
                              </div>
                              <p className="text-neon-blue font-medium">{paymentCountdown} seconds remaining</p>
                            </div>
                          ) : (
                            <div>
                              <p className="mb-4">After payment, click below to confirm:</p>
                              <button 
                                onClick={paymentDone}
                                className="neo-button w-full"
                              >
                                ✔ I Have Paid
                              </button>
                            </div>
                          )}
                        </div>
                      ) : paymentClicked ? (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="txnId" className="block text-sm mb-1">
                              Transaction ID
                            </label>
                            <input
                              type="text"
                              id="txnId"
                              placeholder="Enter UPI Transaction ID"
                              className="neo-input w-full"
                              value={formData.txnId}
                              onChange={handleInputChange}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Find this in your UPI app payment history
                            </p>
                          </div>
                          
                          <button
                            onClick={submitPaymentConfirmation}
                            className="neo-button w-full mt-6 flex items-center justify-center"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>Submit Payment</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="mb-4 text-muted-foreground">
                            Please complete your payment using the UPI app that opened.
                          </p>
                          <button
                            onClick={() => setCurrentStep("payment")}
                            className="neo-button w-full"
                          >
                            Return to Payment Options
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setCurrentStep("payment")}
                        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
                        disabled={isSubmitting}
                      >
                        Go Back
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-muted mb-6">
                        <CheckCircle className="h-12 w-12 text-neon-blue" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
                      <p className="text-muted-foreground">
                        Your payment for {formData.course} has been recorded.
                      </p>
                      <p className="text-muted-foreground text-sm mt-4">
                        Transaction ID: <span className="font-medium">{formData.txnId}</span>
                      </p>
                      
                      <button
                        onClick={resetForm}
                        className="neo-button w-full mt-6"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border text-xs text-center text-muted-foreground">
            <div className="flex items-center justify-center mb-1">
              <Shield className="h-3 w-3 mr-1" /> Secured by PayVerse Nexus
            </div>
            <p>All transactions are encrypted and secure</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentGateway;
