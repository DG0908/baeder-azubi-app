export function AppBackground({ darkMode, playSound }) {
  return (
    <>
      <div className="absolute top-20 left-0 w-full h-32 overflow-hidden pointer-events-none z-0">
        <div className="swimmer animate-swim">
          <span className="text-6xl">🏊‍♂️</span>
        </div>
      </div>

      <div
        className={`absolute inset-0 ${darkMode ? 'opacity-5' : 'opacity-10'}`}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 30px,
            rgba(255, 255, 255, 0.1) 30px,
            rgba(255, 255, 255, 0.1) 60px
          )`,
          animation: 'waves 12s linear infinite',
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white cursor-pointer"
            onClick={() => playSound('bubble')}
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-100px',
              opacity: darkMode ? 0.05 : 0.1,
              animation: `bubble ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              pointerEvents: 'auto',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes waves {
          0% { transform: translateY(0); }
          100% { transform: translateY(-60px); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: ${darkMode ? 0.05 : 0.1}; }
          50% { opacity: ${darkMode ? 0.08 : 0.15}; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes swim {
          0% { transform: translateX(-100px) translateY(0); }
          25% { transform: translateX(25vw) translateY(-20px); }
          50% { transform: translateX(50vw) translateY(0); }
          75% { transform: translateX(75vw) translateY(20px); }
          100% { transform: translateX(calc(100vw + 100px)) translateY(0); }
        }
        .swimmer {
          position: absolute;
          animation: swim 20s linear infinite;
        }
        .animate-swim {
          animation: swim 20s linear infinite;
        }
      `}</style>
    </>
  );
}
