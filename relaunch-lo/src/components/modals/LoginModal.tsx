import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, LogIn, Mail, Lock } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const LoginModal = ({ open, onClose }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      setIsMounted(false);
      onClose();
    }, 300);
  }, [onClose]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLoginClick = () => {
    setIsForgotPassword(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Ein Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail-Adresse gesendet.");
      } else {
        setMessage("Es gab ein Problem. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      setMessage("Es gab ein Problem. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={stopPropagation}
        className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <LogIn className="h-6 w-6 text-brand-600" />
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
              {isForgotPassword ? "Passwort vergessen" : "Einloggen"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* CONTENT */}
        <ScrollArea className="flex-1 overflow-auto pr-3" type="always">
          {isForgotPassword ? (
            <form className="space-y-6 px-1 pb-4" onSubmit={handleForgotPasswordSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="font-semibold text-slate-700 block mb-2 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-brand-600" />
                  E-Mail-Adresse
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    type="email"
                    id="email"
                    placeholder="Ihre E-Mail-Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                  />
                </div>
              </div>
              {message && <p className="text-sm text-center text-slate-700">{message}</p>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-4 rounded-lg transition-all"
              >
                {isSubmitting ? "Senden..." : "Link zum Zurücksetzen senden"}
              </Button>
              <Button
                onClick={handleBackToLoginClick}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-6 px-4 rounded-lg transition-all"
              >
                Zurück zum Login
              </Button>
            </form>
          ) : (
            <form className="space-y-6 px-1 pb-4">
              <div>
                <Label
                  htmlFor="email"
                  className="font-semibold text-slate-700 block mb-2 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-brand-600" />
                  E-Mail-Adresse
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    type="email"
                    id="email"
                    placeholder="Ihre E-Mail-Adresse"
                    required
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="font-semibold text-slate-700 block mb-2 flex items-center gap-2"
                >
                  <Lock className="h-4 w-4 text-brand-600" />
                  Passwort
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    type="password"
                    id="password"
                    placeholder="Ihr Passwort"
                    required
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Passwort vergessen?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-4 rounded-lg transition-all"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Einloggen
              </Button>
            </form>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default LoginModal;
