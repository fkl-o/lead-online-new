import { createContext, useContext, useState, type ReactNode } from 'react';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: 'success' | 'error') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within a SnackbarProvider');
  return ctx;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');

  const showSnackbar = (msg: string, t: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setType(t);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div
        className={`fixed bottom-6 left-1/2 z-[9999] px-6 py-3 rounded shadow-lg text-white transition-all duration-300 pointer-events-none select-none
          ${open ? 'opacity-100 translate-x-[-50%]' : 'opacity-0 translate-y-4 translate-x-[-50%]'}
          ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        style={{ minWidth: 200, textAlign: 'center' }}
      >
        {message}
      </div>
    </SnackbarContext.Provider>
  );
};
