import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import './FAB.css';

const FAB = ({ onClick }) => {
  return (
    <motion.button
      className="fab-button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Plus size={24} />
    </motion.button>
  );
};

export default FAB;
