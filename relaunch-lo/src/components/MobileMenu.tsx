import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Button } from './ui/button';
import { LogIn, Mail } from 'lucide-react';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuVariants: Variants = {
  hidden: {
    y: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          className="fixed inset-0 z-40 bg-white pt-20 hero-pattern"
        >
          <div className="container mx-auto px-6 flex flex-col h-full">
            <nav className="flex flex-col items-center justify-center flex-1 space-y-6 text-center">
              <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/webentwicklung"
                  onClick={onClose}
                  className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-colors duration-300"
                >
                  Webentwicklung
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/marketing-automation"
                  onClick={onClose}
                  className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-colors duration-300"
                >
                  Marketing Automation
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/digitalization"
                  onClick={onClose}
                  className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-colors duration-300"
                >
                  Digitalisierung
                </Link>
              </motion.div>
            </nav>

            <motion.hr variants={itemVariants} className="border-slate-200 my-6" />

            <motion.div
              variants={itemVariants}
              className="pb-8 flex flex-col space-y-4"
            >
               <Button asChild size="lg" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg py-6">
                <Link to="/contact" onClick={onClose}>
                  <Mail className="mr-2 h-5 w-5" />
                  <span>Kontakt aufnehmen</span>
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-lg py-6">
                <Link to="/login" onClick={onClose}>
                  <LogIn className="mr-2 h-5 w-5" />
                  <span>Kunden-Login</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
