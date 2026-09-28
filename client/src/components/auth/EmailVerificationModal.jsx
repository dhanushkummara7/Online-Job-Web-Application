import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';

export const EmailVerificationModal = ({ isOpen, onClose, email, onSuccess }) => {
  const { verifyEmail, resendVerification, openEmailInbox, addToast } = useAuth();
  
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleDigitChange = (index, value) => {
    // Handle paste of whole code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...digits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setDigits(newDigits);
        const nextIndex = Math.min(pasted.length, 5);
        if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
        
        if (pasted.length === 6) {
          triggerSubmit(pasted);
        }
      }
      return;
    }

    const char = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits filled
    if (char && index === 5 && newDigits.every(d => d !== '')) {
      triggerSubmit(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const triggerSubmit = async (codeToSubmit) => {
    const code = codeToSubmit || digits.join('');
    if (code.length < 6) {
      addToast('Please enter all 6 digits of your verification code.', 'error');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(code, email);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      // Error handled in verifyEmail toast
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await resendVerification(email);
      setCountdown(60);
    } catch (err) {
      // Toast already fired
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-600/30 mb-5">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Verify Your Email
        </h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          We sent a 6-digit confirmation code to:
          <br />
          <span className="font-semibold text-indigo-300 break-all">{email}</span>
        </p>

        {/* 6 Digit Input Cells */}
        <div className="flex justify-center gap-2 sm:gap-3 my-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white outline-none transition-all"
            />
          ))}
        </div>

        {/* Open Email Inbox Helper Button */}
        <button
          type="button"
          onClick={() => openEmailInbox()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-5 rounded-xl text-xs font-semibold bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 transition-all hover:scale-[1.01]"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Open Email Inbox to view code</span>
          <ExternalLink className="w-3 h-3 text-indigo-400" />
        </button>

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => triggerSubmit()}
          disabled={loading || digits.some(d => d === '')}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend Action */}
        <div className="mt-5 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <span>Didn't receive the code?</span>
          {countdown > 0 ? (
            <span className="text-slate-500 font-medium">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
