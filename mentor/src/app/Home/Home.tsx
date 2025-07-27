'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const options = [
  {
    label: 'EduBot',
    description: 'Your helpful educational assistant',
    route: '/edubot',
    emoji: '🤖',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  {
    label: 'Analytics',
    description: 'View your learning analytics and progress',
    route: '/analytics',
    emoji: '📊',
    color: 'linear-gradient(135deg, #FF9A9E, #FECFEC)',
  },
  {
    label: 'Take A Quiz',
    description: 'Test your knowledge with a quiz',
    route: '/quiz',
    emoji: '📝',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <div className="main-options-container">
        <h1 className="main-title">Welcome! What would you like to do?</h1>
        <div className="options-grid">
          {options.map(({ label, route, emoji, description, color }) => (
            <div
              key={label}
              className="option-card"
              onClick={() => router.push(route)}
              style={{ background: color }}
              tabIndex={0}
              role="button"
              aria-label={label}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push(route); }}
            >
              <span className="option-emoji">{emoji}</span>
              <span className="option-label">{label}</span>
              <span className="option-description">{description}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .main-options-container {
          height: 100vh;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .main-title {
          color: #222;
          font-size: 2.6rem;
          font-weight: 700;
          margin-bottom: 48px;
          letter-spacing: -1px;
          text-align: center;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          width: 100%;
        }

        @media (min-width: 700px) {
          .options-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
        }

        .option-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 28px;
          height: 260px;
          transition: transform 0.18s cubic-bezier(.17,.67,.9,1.24), box-shadow 0.18s;
          box-shadow: 0 2px 18px rgba(90,70,180,0.08);
          color: #fff;
          outline: none;
          user-select: none;
        }
        .option-card:focus,
        .option-card:hover {
          box-shadow: 0 8px 32px rgba(90,70,180,0.13);
          transform: translateY(-6px) scale(1.04);
        }

        .option-emoji {
          font-size: 3.8rem;
          margin-bottom: 14px;
        }
        .option-label {
          font-size: 2.1rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .option-description {
          font-size: 1.05rem;
          opacity: 0.92;
          text-align: center;
          max-width: 180px;
        }
      `}</style>
    </>
  );
}
