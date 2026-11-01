import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// 1. User sends phone number request
export const requestOwnerContact = async (chatId) => {
  if (!chatId) return;

  const threadRef = doc(db, 'chatThreads', chatId);
  const threadSnap = await getDoc(threadRef);

  if (!threadSnap.exists()) {
    throw new Error("Chat session not found in Firestore.");
  }

  const data = threadSnap.data();
  const existingMessages = data.messages || [];
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newRequestCard = {
    id: `req_${Date.now()}`,
    type: 'contact_request',
    status: 'pending',
    sender: 'user',
    text: '📱 Requested owner direct phone number.',
    time: timeStr,
    createdAt: new Date().toISOString()
  };

  await updateDoc(threadRef, {
    messages: [...existingMessages, newRequestCard],
    unreadForOwner: true,
    lastActive: timeStr
  });
};

// 2. Owner approves or declines the request
export const respondToContactRequest = async (chatId, messageId, status, phoneNumber = '', durationMinutes = 5) => {
  if (!chatId) return;

  const threadRef = doc(db, 'chatThreads', chatId);
  const threadSnap = await getDoc(threadRef);

  if (!threadSnap.exists()) return;

  const data = threadSnap.data();
  const existingMessages = data.messages || [];

  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

  const updatedMessages = existingMessages.map((msg) => {
    if (msg.id === messageId || (msg.type === 'contact_request' && msg.status === 'pending')) {
      return {
        ...msg,
        status, // 'approved' | 'declined'
        phoneNumber: status === 'approved' ? phoneNumber : null,
        expiresAt: status === 'approved' ? expiresAt : null,
        durationMinutes: status === 'approved' ? durationMinutes : null
      };
    }
    return msg;
  });

  await updateDoc(threadRef, {
    messages: updatedMessages
  });
};