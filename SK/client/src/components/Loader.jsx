import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #4a2525 50%, #2B1B1B 100%)' }}>
      
      {/* Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Logo Mark */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-28 rounded-full border-2 flex items-center justify-center mb-6"
          style={{ borderColor: '#C8A96A', background: 'rgba(200, 169, 106, 0.1)' }}
        >
          <span style={{ fontFamily: "'Playfair Display', serif", color: '#C8A96A', fontSize: '2.5rem', fontWeight: '700' }}>
            SK
          </span>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#FAF7F5',
            fontSize: '1.8rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            lineHeight: 1.2,
          }}>
            Sri Kanakadhara
          </h1>
          <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', fontFamily: 'Poppins', marginTop: '4px', textTransform: 'uppercase' }}>
            Designer Studio
          </p>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #C8A96A, transparent)', margin: '1.5rem 0' }}
        />

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C8A96A' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;
