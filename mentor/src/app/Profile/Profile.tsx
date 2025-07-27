'use client'; // Required if using Next.js App Router for client-side interaction
import React, { useRef, useEffect } from 'react';

const AVATARS = [
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma', alt: 'Avatar 1' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex', alt: 'Avatar 2' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam', alt: 'Avatar 3' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Taylor', alt: 'Avatar 4' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jordan', alt: 'Avatar 5' },
];

const ProfilePage: React.FC = () => {
  const avatarImgRef = useRef<HTMLImageElement | null>(null);
  const mainAvatarRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  // For scroll reveal
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    function animateOnScroll() {
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          (section as HTMLElement).style.opacity = '1';
          (section as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }
    // Initial state
    sections.forEach(section => {
      (section as HTMLElement).style.opacity = '0';
      (section as HTMLElement).style.transform = 'translateY(20px)';
      (section as HTMLElement).style.transition = 'all 0.6s ease';
    });
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  // Badges click animation
  useEffect(() => {
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
      badge.addEventListener('click', function () {
        (badge as HTMLElement).style.transform = 'scale(0.95)';
        setTimeout(() => {
          (badge as HTMLElement).style.transform = 'translateY(-5px)';
        }, 100);
      });
    });
    return () => {
      badges.forEach(badge => {
        badge.replaceWith(badge.cloneNode(true));
      });
    };
  }, []);

  // Streak counter animation
  useEffect(() => {
    let currentStreak = 0;
    const targetStreak = 12;
    const streakNumber = document.querySelector('.streak-number');
    function animateStreak() {
      if (currentStreak < targetStreak && streakNumber) {
        currentStreak++;
        (streakNumber as HTMLElement).textContent = currentStreak.toString();
        setTimeout(animateStreak, 100);
      }
    }
    setTimeout(animateStreak, 1000);
  }, []);

  // Avatar switching
  const changeAvatar = (avatarUrl: string, idx: number) => {
    setActiveIdx(idx);
    if (avatarImgRef.current) avatarImgRef.current.src = avatarUrl;
    if (mainAvatarRef.current) {
      mainAvatarRef.current.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (mainAvatarRef.current)
          mainAvatarRef.current.style.transform = 'scale(1)';
      }, 150);
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar" id="mainAvatar" ref={mainAvatarRef}>
            <img
              src={AVATARS[activeIdx].url}
              alt="Profile Avatar"
              id="avatarImg"
              ref={avatarImgRef}
            />
          </div>

          <div className="avatar-selector">
            {AVATARS.map((avatar, idx) => (
              <div
                className={
                  'avatar-option' + (activeIdx === idx ? ' active' : '')
                }
                key={avatar.url}
                onClick={() => changeAvatar(avatar.url, idx)}
              >
                <img src={avatar.url} alt={avatar.alt} />
              </div>
            ))}
          </div>

          <h1 className="profile-name">Emma Johnson</h1>
          <p className="profile-subtitle">Grade 7 • Mathematics Enthusiast</p>
        </div>

        <div className="profile-content">
          <div className="section">
            <h2 className="section-title">📋 Basic Information</h2>
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">Emma Rose Johnson</span>
            </div>
            <div className="info-item">
              <span className="info-label">Display Name</span>
              <span className="info-value">Emma</span>
            </div>
            <div className="info-item">
              <span className="info-label">Age</span>
              <span className="info-value">13 years old</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">March 15, 2011</span>
            </div>
            <div className="info-item">
              <span className="info-label">Grade Level</span>
              <span className="info-value">7th Grade</span>
            </div>
            <div className="info-item">
              <span className="info-label">Preferred Language</span>
              <span className="info-value">English</span>
            </div>
            <div className="info-item">
              <span className="info-label">School</span>
              <span className="info-value">Riverside Middle School</span>
            </div>
            <div className="info-item">
              <span className="info-label">Guardian Email</span>
              <span className="info-value">parent@email.com</span>
            </div>
            <button className="edit-btn">Edit Profile</button>
          </div>

          <div className="section">
            <h2 className="section-title">📚 Academic Preferences</h2>
            <h3 style={{ marginBottom: 10, color: '#555' }}>Subjects of Interest</h3>
            <div className="subjects-grid">
              <div className="subject-tag">Mathematics</div>
              <div className="subject-tag">Science</div>
              <div className="subject-tag">English</div>
              <div className="subject-tag">History</div>
              <div className="subject-tag">Art</div>
              <div className="subject-tag">Music</div>
            </div>

            <h3 style={{ margin: '25px 0 10px', color: '#555' }}>Learning Goals</h3>
            <div className="goals-list">
              <div className="goal-item">
                <div className="goal-type">Short-term</div>
                <div>Master multiplication tables up to 12x12</div>
              </div>
              <div className="goal-item">
                <div className="goal-type">Short-term</div>
                <div>Improve reading comprehension scores</div>
              </div>
              <div className="goal-item">
                <div className="goal-type">Long-term</div>
                <div>Prepare for Science Olympiad competition</div>
              </div>
              <div className="goal-item">
                <div className="goal-type">Long-term</div>
                <div>Achieve Honor Roll status</div>
              </div>
            </div>
          </div>

          <div className="section progress-section">
            <h2 className="section-title">📈 Progress Tracking</h2>

            <div className="streak-counter">
              <div className="streak-number">12</div>
              <div>Days Learning Streak! 🔥</div>
              <p style={{ marginTop: 10, opacity: 0.9 }}>
                Keep it up! You're doing amazing!
              </p>
            </div>

            <h3 style={{ marginBottom: 15, color: '#555' }}>Achievements & Badges</h3>
            <div className="badges-container">
              <div className="badge">
                <div className="badge-icon">🧮</div>
                <div className="badge-name">Math Master</div>
                <div className="badge-desc">Completed 50+ math problems</div>
              </div>
              <div className="badge">
                <div className="badge-icon">📚</div>
                <div className="badge-name">Reading Star</div>
                <div className="badge-desc">Read 10 books this month</div>
              </div>
              <div className="badge">
                <div className="badge-icon">✍️</div>
                <div className="badge-name">Grammar Guru</div>
                <div className="badge-desc">Perfect grammar test scores</div>
              </div>
              <div className="badge">
                <div className="badge-icon">🔬</div>
                <div className="badge-name">Science Explorer</div>
                <div className="badge-desc">Completed 5 experiments</div>
              </div>
              <div className="badge">
                <div className="badge-icon">🎯</div>
                <div className="badge-name">Goal Achiever</div>
                <div className="badge-desc">Reached 3 learning goals</div>
              </div>
              <div className="badge">
                <div className="badge-icon">⚡</div>
                <div className="badge-name">Speed Learner</div>
                <div className="badge-desc">Quick problem solver</div>
              </div>
            </div>

            <div className="topics-covered">
              <h3 style={{ marginBottom: 10, color: '#555' }}>Topics Covered So Far</h3>
              <div className="topics-list">
                <div className="topic-item">Fractions & Decimals</div>
                <div className="topic-item">Photosynthesis</div>
                <div className="topic-item">American Revolution</div>
                <div className="topic-item">Creative Writing</div>
                <div className="topic-item">Geometry Basics</div>
                <div className="topic-item">Solar System</div>
                <div className="topic-item">Poetry Analysis</div>
                <div className="topic-item">World War II</div>
                <div className="topic-item">Algebra Introduction</div>
                <div className="topic-item">Cell Biology</div>
                <div className="topic-item">Essay Writing</div>
                <div className="topic-item">Ancient Civilizations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles, direct port of original CSS */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .profile-header {
          background: linear-gradient(135deg, #ff6b6b, #ffa726);
          padding: 40px;
          text-align: center;
          color: white;
          position: relative;
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 5px solid rgba(255, 255, 255, 0.3);
          margin: 0 auto 20px;
          overflow: hidden;
          background: white;
          transition: transform 0.3s ease;
        }
        .profile-avatar:hover {
          transform: scale(1.05);
        }
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-selector {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 15px 0;
          flex-wrap: wrap;
        }
        .avatar-option {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .avatar-option:hover,
        .avatar-option.active {
          border-color: white;
          transform: scale(1.1);
        }
        .avatar-option img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-name {
          font-size: 2.5rem;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .profile-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        .profile-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          padding: 40px;
        }
        .section {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .section-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #666;
        }
        .info-value {
          color: #333;
          font-weight: 500;
        }
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .subject-tag {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 10px 15px;
          border-radius: 25px;
          text-align: center;
          font-weight: 500;
          transition: transform 0.3s ease;
        }
        .subject-tag:hover {
          transform: translateY(-2px);
        }
        .goals-list {
          margin-top: 15px;
        }
        .goal-item {
          background: #f8f9ff;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          border-left: 4px solid #667eea;
        }
        .goal-type {
          font-size: 0.85rem;
          color: #667eea;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .progress-section {
          grid-column: 1 / -1;
        }
        .streak-counter {
          background: linear-gradient(135deg, #ff9a9e, #fecfef);
          color: white;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 20px;
        }
        .streak-number {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .badges-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .badge {
          background: white;
          border: 2px solid #f0f0f0;
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .badge:hover {
          border-color: #667eea;
          transform: translateY(-5px);
        }
        .badge-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .badge-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        .badge-desc {
          font-size: 0.9rem;
          color: #666;
        }
        .topics-covered {
          background: #f8f9ff;
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
        }
        .topics-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        .topic-item {
          background: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #555;
          border: 1px solid #e0e0e0;
        }
        .edit-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-top: 20px;
        }
        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        @media (max-width: 768px) {
          .profile-content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
          }
          .profile-name {
            font-size: 2rem;
          }
          .avatar-selector {
            gap: 5px;
          }
          .avatar-option {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePage;