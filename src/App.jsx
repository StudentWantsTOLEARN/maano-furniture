import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PromoVideoBanner from './components/PromoVideoBanner';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import ImagePreviewModal from './components/ImagePreviewModal';
import ChatDrawer from './components/ChatDrawer';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import MyReservationsModal from './components/MyReservationsModal';
import Footer from './components/Footer';

// Firebase Imports
import { 
  auth, 
  db, 
  loginWithGoogle, 
  loginWithFacebook, 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser,
  updateUserProfilePhoto 
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

// Web Audio API Chime Generator
const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playNote(659.25, 0, 0.25);    // E5
    playNote(987.77, 0.08, 0.35);  // B5
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [reservations, setReservations] = useState([]);
  
  const [shops] = useState([
    { id: 'shop-1', name: 'Maano Woodcraft Palawan', rating: 4.9, location: 'Puerto Princesa, Palawan' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // STATE FOR EYE ICON BUILT MATERIAL & WOOD SPECS MODAL
  const [previewProduct, setPreviewProduct] = useState(null);

  // STATE FOR REAL-TIME OWNER PROMO VIDEO BROADCAST
  const [activePromo, setActivePromo] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);
  
  const [activeShop] = useState('Maano Woodcraft Palawan');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [user, setUser] = useState(null);

  const AUTHORIZED_ADMIN_EMAILS = [
    'jaysonmaano600@gmail.com',
    'jaysonmaano1@gmail.com',
    'elmamaanolustado2025@gmail.com',
    'admin4@gmail.com',
    'admin5@gmail.com'
  ];

  const categories = ['All', 'Living Room', 'Dining', 'Bedroom', 'Office'];

  const prevThreadMessageCounts = useRef({});
  const isFirstChatSnapshot = useRef(true);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userEmail = currentUser.email?.toLowerCase() || '';
        const isAdminAccount = AUTHORIZED_ADMIN_EMAILS.includes(userEmail);

        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          photoURL: currentUser.photoURL || null,
          isAdmin: isAdminAccount
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-Time Products Listener
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const liveProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(liveProducts);
    });

    return () => unsubscribe();
  }, []);

  // 3. Real-Time Promo Video Broadcast Listener
  useEffect(() => {
    const promoRef = doc(db, 'promos', 'activePromo');
    const unsubscribe = onSnapshot(promoRef, (docSnap) => {
      if (docSnap.exists()) {
        setActivePromo(docSnap.data());
      } else {
        setActivePromo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 4. Real-Time Chat Listener
  const [chatThreads, setChatThreads] = useState([]);

  useEffect(() => {
    const chatRef = collection(db, 'chatThreads');
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const threads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isFirstChatSnapshot.current) {
        isFirstChatSnapshot.current = false;
        threads.forEach(t => {
          prevThreadMessageCounts.current[t.id] = t.messages?.length || 0;
        });
      } else {
        let soundShouldPlay = false;

        threads.forEach(t => {
          const prevCount = prevThreadMessageCounts.current[t.id] || 0;
          const currentMessages = t.messages || [];
          const newCount = currentMessages.length;

          if (newCount > prevCount) {
            const lastMsg = currentMessages[currentMessages.length - 1];

            if (user?.isAdmin && lastMsg?.sender === 'user') {
              soundShouldPlay = true;
            }

            if (!user?.isAdmin && user?.uid && t.id === `thread_${user.uid}` && lastMsg?.sender === 'owner') {
              soundShouldPlay = true;
            }
          }

          prevThreadMessageCounts.current[t.id] = newCount;
        });

        if (soundShouldPlay) playNotificationChime();
      }

      setChatThreads(threads);
    });

    return () => unsubscribe();
  }, [user]);

  // 5. Real-Time Reservations Listener
  useEffect(() => {
    const resRef = collection(db, 'reservations');
    const unsubscribe = onSnapshot(resRef, (snapshot) => {
      const liveReservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(liveReservations);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.shopName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      setIsAuthOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await loginWithFacebook();
      setIsAuthOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmailSignUp = async (email, password, name) => {
    try {
      await registerWithEmail(email, password, name);
      setIsAuthOpen(false);
    } catch (err) {
      const code = err?.code || err?.message || '';
      if (code.includes('email-already-in-use')) {
        throw new Error('This email is already registered. Please sign in instead.');
      } else if (code.includes('weak-password')) {
        throw new Error('Password should be at least 6 characters long.');
      } else {
        throw new Error('Sign up failed. Please check your information and try again.');
      }
    }
  };

  const handleEmailSignIn = async (email, password) => {
    try {
      await loginWithEmail(email, password);
      setIsAuthOpen(false);
    } catch (err) {
      const code = err?.code || err?.message || '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        throw new Error('Wrong password or email, try again');
      } else {
        throw new Error('Wrong password or email, try again');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAvatar = async (photoDataUrl) => {
    setUser(prev => prev ? { ...prev, photoURL: photoDataUrl } : null);
    try {
      if (typeof updateUserProfilePhoto === 'function') {
        await updateUserProfilePhoto(photoDataUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe Reservation Creator & Automatic Chat Synchronizer
  const handleCreateReservation = async (product) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!product) {
      alert("Invalid product selection.");
      return;
    }

    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const reservationData = {
      productId: product.id || '',
      productName: product.name || 'Handcrafted Furniture Item',
      productPrice: Number(product.price) || 0,
      productImage: product.image || '',
      userId: user.uid || '',
      userName: user.name || user.email?.split('@')[0] || 'Valued Customer',
      userEmail: user.email || '',
      status: 'pending',
      pinCode: randomPin,
      dateStr: dateStr,
      createdAt: serverTimestamp()
    };

    try {
      // 1. Save reservation
      await addDoc(collection(db, 'reservations'), reservationData);

      // 2. Post reservation receipt directly into the user-admin chat thread
      const threadId = `thread_${user.uid}`;
      const threadRef = doc(db, 'chatThreads', threadId);

      const reservationMsgText = `📌 [NEW ITEM RESERVATION]\nItem: ${reservationData.productName}\nPrice: ₱${reservationData.productPrice.toLocaleString()}\nVerification PIN: ${randomPin}\nStatus: Awaiting Confirmation`;
      
      const existingThread = chatThreads.find(t => t.id === threadId);
      const existingMessages = existingThread?.messages || [];
      const newChatMessage = { sender: 'user', text: reservationMsgText, time: timeStr };

      await setDoc(threadRef, {
        customerName: user.name,
        customerEmail: user.email,
        shopName: activeShop,
        lastActive: timeStr,
        unreadForOwner: true,
        messages: [...existingMessages, newChatMessage]
      }, { merge: true });

      alert(`Reservation created successfully!\n\nYour Verification PIN Code is: ${randomPin}\nA receipt was also sent to your Shop Chat.`);
      setIsReservationsOpen(true);
    } catch (err) {
      console.error("Firestore Reservation Error:", err);
      alert(`Reservation Error: ${err.message || 'Permission denied or network issue.'}`);
    }
  };

  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      const resRef = doc(db, 'reservations', reservationId);
      await updateDoc(resRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating reservation:", err);
    }
  };

  const handleAddProduct = async (newProd) => {
    try {
      await addDoc(collection(db, 'products'), { ...newProd, createdAt: serverTimestamp() });
      alert('Product published!');
    } catch (err) {
      alert(`Failed: ${err.message}`);
    }
  };

  const handleUpdateProduct = async (id, updatedFields) => {
    try {
      await updateDoc(doc(db, 'products', id), updatedFields);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      alert(`Failed: ${err.message}`);
    }
  };

  const handleCustomerSendMessage = async (text) => {
    if (!user) {
      setIsAuthOpen(true);
      return null;
    }

    const threadId = `thread_${user.uid}`;
    const threadRef = doc(db, 'chatThreads', threadId);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = { sender: 'user', text, time: timeStr };

    try {
      const existingThread = chatThreads.find(t => t.id === threadId);
      const existingMessages = existingThread?.messages || [];

      await setDoc(threadRef, {
        customerName: user.name,
        customerEmail: user.email,
        shopName: activeShop,
        lastActive: timeStr,
        unreadForOwner: true,
        messages: [...existingMessages, newMessage]
      }, { merge: true });

      return threadId; // Returns threadId so ChatDrawer can immediately register the active chat session!
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleOwnerSendMessage = async (threadId, text) => {
    if (!threadId || !text.trim()) return;

    const threadRef = doc(db, 'chatThreads', threadId);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = { sender: 'owner', text, time: timeStr };

    try {
      const existingThread = chatThreads.find(t => t.id === threadId);
      const existingMessages = existingThread?.messages || [];

      await setDoc(threadRef, {
        lastActive: timeStr,
        unreadForOwner: false,
        messages: [...existingMessages, newMessage]
      }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const currentThread = useMemo(() => {
    if (!user) return null;
    return chatThreads.find(t => t.id === `thread_${user.uid}`);
  }, [chatThreads, user]);

  return (
    <div className="min-h-screen flex flex-col bg-woody-50">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onLogout={handleLogout}
        onUpdateAvatar={handleUpdateAvatar}
        unreadCount={chatThreads.filter(t => t.unreadForOwner).length}
        userReservationsCount={reservations.filter(r => r.userId === user?.uid).length}
      />

      <main className="flex-1">
        <Hero
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* REAL-TIME BROADCAST PROMO VIDEO BANNER */}
        <PromoVideoBanner
          promoData={activePromo}
          onOpenChat={() => setIsChatOpen(true)}
        />

        <ProductGrid
          products={filteredProducts}
          onSelectProduct={setSelectedProduct}
          onOpenImagePreview={(prod) => setPreviewProduct(prod)}
          onOpenChatWithShop={() => setIsChatOpen(true)}
        />
      </main>

      <Footer 
        user={user} 
        onTriggerAdmin={() => {
          if (user && user.isAdmin) setIsAdminOpen(true);
        }} 
      />

      {/* STANDARD PRODUCT DETAILS MODAL */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenChatWithShop={() => setIsChatOpen(true)}
        onReserveProduct={handleCreateReservation}
      />

      {/* EYE ICON: BUILT MATERIAL & WOOD SPECS MODAL */}
      <ImagePreviewModal
        isOpen={Boolean(previewProduct)}
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onReserveProduct={handleCreateReservation}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* CHAT DRAWER WITH DIRECT CONTACT REQUEST & CHAT ID INTEGRATION */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeShop={activeShop}
        chatId={currentThread ? currentThread.id : (user ? `thread_${user.uid}` : null)}
        messages={currentThread ? currentThread.messages : []}
        onCustomerSendMessage={handleCustomerSendMessage}
      />

      <MyReservationsModal
        isOpen={isReservationsOpen}
        onClose={() => setIsReservationsOpen(false)}
        reservations={reservations}
        user={user}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
        onEmailSignUp={handleEmailSignUp}
        onEmailSignIn={handleEmailSignIn}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        user={user}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        chatThreads={chatThreads}
        onOwnerSendMessage={handleOwnerSendMessage}
        reservations={reservations}
        onUpdateReservationStatus={handleUpdateReservationStatus}
      />
    </div>
  );
}