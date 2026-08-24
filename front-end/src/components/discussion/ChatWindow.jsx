// C:\Users\ASUS\Desktop\projet_photographie\front-end\src\components\discussion\ChatWindow.jsx
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageForm from './MessageForm';

const ChatWindow = ({ activeConversation, messages, currentUserId, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full md:w-3/5 h-3/5 md:h-full bg-[#f8f9f8] p-6 md:p-12 pt-16 md:pt-36 flex flex-col justify-between relative z-10 overflow-hidden">
      <div className="absolute top-1/4 right-[-10%] w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-60 h-60 bg-[#aec3b0]/15 rounded-full blur-3xl pointer-events-none" />

      {activeConversation ? (
        <>
          <div className="flex justify-between items-center border-b border-[#2d3a30]/10 pb-4 select-none relative z-10">
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#2d3a30]/40 uppercase">
                {activeConversation.is_global_user ? "Nouvelle Correspondance" : "Salon Privé"}
              </span>
              <h2 className="font-serif text-xl italic text-[#2d3a30]">
                {activeConversation.photographe_nom || activeConversation.client_nom || activeConversation.nom_complet}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto my-6 pr-2 space-y-4 custom-scrollbar flex flex-col relative z-10">
            <AnimatePresence initial={false}>
              {messages && messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.expediteur?.id === currentUserId || msg.sender === 'me';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`max-w-[75%] p-4 rounded-3xl text-sm tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.02)] border relative ${
                        isMe 
                          ? 'bg-[#2d3a30] border-[#2d3a30]/10 text-white rounded-br-none self-end' 
                          : 'bg-white/80 border-black/[0.04] backdrop-blur-md text-[#2d3a30] rounded-bl-none self-start'
                      }`}
                    >
                      {msg.contenu && <p className="leading-relaxed whitespace-pre-wrap relative z-10">{msg.contenu}</p>}
                      <span className={`font-mono text-[8px] mt-2 block text-right opacity-60 ${isMe ? 'text-white/70' : 'text-[#2d3a30]/50'}`}>
                        {new Date(msg.sent_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="my-auto text-center opacity-40 select-none">
                  <p className="font-serif italic text-xs text-[#2d3a30]">Aucun historique.</p>
                  <p className="font-sans text-[9px] uppercase tracking-wider mt-1 text-[#2d3a30]">Envoyez un premier message pour lancer la discussion.</p>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <MessageForm onSendMessage={onSendMessage} />
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none relative z-10">
          <svg className="w-8 h-8 text-[#2d3a30] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="font-serif italic text-sm text-[#2d3a30]">Aucune correspondance active.</p>
          <p className="font-sans text-[10px] uppercase tracking-widest mt-1 text-[#2d3a30]/70">Sélectionnez un correspondant ou recherchez un utilisateur global</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;