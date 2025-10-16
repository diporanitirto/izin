export default function Footer() {
  return (
    <footer className="mt-7 max-w-[900px] mx-auto text-center text-mediumBrown" role="contentinfo">
      <div className="flex items-center justify-center gap-2.5 py-2.5">
        <div className="inline-flex gap-2 opacity-90" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" fill="none" stroke="#5D4037" strokeWidth="1.5"/>
            <path d="M14.5 9.5 L10.2 10.8 L9 15 L13.3 13.7 Z" fill="#8D6E63" stroke="#5D4037" strokeWidth="0.8"/>
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M20 4 C13 4, 8 9, 8 16 C8 16, 8 20, 4 20 C10 20, 16 16, 20 10 Z" fill="#4CAF50" opacity="0.85"/>
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M12 12 C10 10, 10 8, 12 6 C14 8, 14 10, 12 12 Z" fill="#FF9800"/>
            <line x1="8" y1="16" x2="16" y2="19" stroke="#795548" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="16" x2="8" y2="19" stroke="#795548" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <small>Pramuka • Berani, Jujur, Tangguh</small>
      </div>
    </footer>
  );
}
