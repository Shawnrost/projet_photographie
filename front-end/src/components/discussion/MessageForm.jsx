// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\discussion\MessageForm.jsx
import { useState } from 'react';

const MessageForm = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 border-t border-[#2d3a30]/10 pt-4 relative z-10">
      <input 
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Écrire votre message..."
        className="flex-1 bg-white/70 border border-[#2d3a30]/10 focus:border-[#2d3a30] rounded-2xl pl-5 pr-12 py-4 text-sm outline-none shadow-sm backdrop-blur-md"
      />
      <button type="submit" className="px-6 bg-[#2d3a30] text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  );
};

export default MessageForm;