import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosConfig';
import socket from '../utils/socket';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.user);
  const connections = useSelector((state) => state.connections);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const activeConnection =
    connections && connections.find((c) => c._id === userId);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/messages/${userId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    const handleIncoming = (message) => {
      if (
        message &&
        (message.from === userId || message.to === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('chat:message', handleIncoming);

    return () => {
      socket.off('chat:message', handleIncoming);
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setError('');
    try {
      const res = await axiosInstance.post(`/messages/${userId}`, {
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message) =>
    loggedInUser && message.from === loggedInUser._id;

  const avatarUrl =
    activeConnection?.profilepic ||
    'https://img.daisyui.com/images/profile/demo/spiderperson@192.webp';

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto my-2 bg-neutral rounded-lg shadow h-[70vh] md:h-[72vh]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-base-300 gap-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="btn btn-primary btn-xs sm:btn-sm"
            onClick={() => navigate('/connections')}
          >
            ← Back
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-base-300 shrink-0">
              <img
                src={avatarUrl}
                alt={activeConnection ? activeConnection.firstName : 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm sm:text-lg truncate">
                {activeConnection
                  ? `${activeConnection.firstName} ${activeConnection.lastName}`
                  : 'Chat'}
              </h2>
              {activeConnection && (
                <p className="text-[11px] sm:text-xs text-base-content/60 truncate">
                  {activeConnection.skills?.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 sm:px-4 sm:py-3">
        {loading && (
          <div className="flex justify-center my-4">
            <span className="loading loading-spinner" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-base-content/60">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              isOwnMessage(message) ? 'chat-end' : 'chat-start'
            }`}
          >
            <div className="chat-bubble">
              <p className="text-sm">{message.content}</p>
              <span className="chat-footer text-[10px] opacity-70 mt-1">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-base-300 px-3 py-2 flex gap-2 sm:px-4 sm:py-3"
      >
        <input
          type="text"
          className="input input-bordered w-full input-sm sm:input-md"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm sm:btn-md">
          Send
        </button>
      </form>

      {error && (
        <div className="px-4 pb-3">
          <div className="alert alert-error text-sm">{error}</div>
        </div>
      )}
    </div>
  );
};

export default Chat;

