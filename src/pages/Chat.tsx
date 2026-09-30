import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  type: 'text' | 'image' | 'audio';
  fileUrl?: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'سلام! به چت تقلب خوش اومدی 👋', sender: 'other', time: '۱۰:۳۰', type: 'text' },
    { id: 2, text: 'مرسی! خیلی خوشحالم اینجام 😊', sender: 'me', time: '۱۰:۳۱', type: 'text' },
    { id: 3, text: 'می‌تونی عکس، صوت و متن بفرستی', sender: 'other', time: '۱۰:۳۲', type: 'text' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const replies = [
        'عالیه! 👍',
        'خیلی جالبه 😄',
        'ادامه بده...',
        'موافقم!',
        'بذار فکر کنم 🤔',
        'چه خوب! 🎉',
      ];
      const reply: Message = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'other',
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage: Message = {
          id: Date.now(),
          text: '📷 تصویر',
          sender: 'me',
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          type: 'image',
          fileUrl: event.target?.result as string,
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newMessage: Message = {
          id: Date.now(),
          text: '🎤 پیام صوتی',
          sender: 'me',
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          type: 'audio',
          fileUrl: audioUrl,
        };
        setMessages((prev) => [...prev, newMessage]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('دسترسی به میکروفون ممکن نیست');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-t-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
          💬
        </div>
        <div>
          <h2 className="font-bold text-lg">چت تقلب</h2>
          <p className="text-sm text-green-400">آنلاین</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-sm border-x border-white/10 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl p-3 ${
                msg.sender === 'me'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 rounded-tr-sm'
                  : 'bg-white/10 rounded-tl-sm'
              }`}
            >
              {msg.type === 'text' && <p className="text-sm leading-relaxed">{msg.text}</p>}
              {msg.type === 'image' && msg.fileUrl && (
                <img
                  src={msg.fileUrl}
                  alt="تصویر"
                  className="rounded-lg max-w-full max-h-60 object-cover"
                />
              )}
              {msg.type === 'audio' && msg.fileUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎤</span>
                  <audio controls className="h-8">
                    <source src={msg.fileUrl} type="audio/webm" />
                  </audio>
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-1 text-left">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-300 font-mono">{formatTime(recordingTime)}</span>
          <button
            onClick={stopRecording}
            className="px-4 py-1 bg-red-500 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
          >
            توقف
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-b-2xl p-4">
        <div className="flex items-center gap-2">
          {/* Image Upload */}
          <label className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {/* Voice Record */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 placeholder-gray-500"
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
