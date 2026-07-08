import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Hash, 
    MessageSquare, 
    Send, 
    ChevronRight,
    Loader2,
    Search
} from 'lucide-react';
import { toast } from 'react-toastify';
import { http } from '../../../admin/api/http';
import styles from './ChatSystem.module.css';

export default function ChatSystem({ currentUserRole, currentUserId }) {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const messagesEndRef = useRef(null);

    // ... (logic)

    const filteredGroups = groups.filter(g => 
        g.nom?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Initial Load: Fetch Groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const endpoint = '/my-groups';
                const response = await http.get(endpoint);
                let groupsData = response?.data?.data || response?.data || [];
                setGroups(groupsData);
                if (groupsData.length === 1) setSelectedGroup(groupsData[0]);
            } catch (error) {
                toast.error("Impossible de charger vos groupes");
            }
        };
        fetchGroups();
    }, [currentUserRole]);

    // Load Channels when a group is selected
    useEffect(() => {
        if (!selectedGroup) return;
        const loadChannels = async () => {
            try {
                const response = await http.get(`/groups/${selectedGroup.id}/channels`);
                setChannels(response?.data?.data || response?.data || []);
            } catch (error) {
                toast.error("Erreur lors du chargement des canaux");
            }
        };
        loadChannels();
    }, [selectedGroup]);

    const fetchMessages = async (channelId, isSilent = false) => {
        if (!isSilent) setLoadingMessages(true);
        try {
            const response = await http.get(`/channels/${channelId}/messages`);
            const msgs = response?.data?.data || response?.data || [];
            if (Array.isArray(msgs)) setMessages(msgs);
        } catch (error) {
            console.error("Fetch Messages erreur:", error);
        } finally {
            if (!isSilent) setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (!selectedChannel) {
            setMessages([]);
            return;
        }
        fetchMessages(selectedChannel.id, false);
        const intervalId = setInterval(() => fetchMessages(selectedChannel.id, true), 3000);
        return () => clearInterval(intervalId);
    }, [selectedChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChannel) return;
        const contentToSave = newMessage.trim();
        setNewMessage('');
        try {
            const response = await http.post('/messages', {
                content: contentToSave,
                channel_id: selectedChannel.id
            });
            const newlyCreatedMessage = response?.data?.data || response?.data;
            if (newlyCreatedMessage) setMessages(prev => [...prev, newlyCreatedMessage]);
        } catch (error) {
            toast.error("L'envoi a échoué");
            setNewMessage(contentToSave);
        }
    };

    return (
        <div className={styles.container}>
            {/* Sidebar GAUCHE - Slack/Linear Style */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.workspaceInfo}>
                        <div className={styles.workspaceIcon}>NT</div>
                        <div>
                            <h3 className={styles.workspaceName}>ISTA NTIC</h3>
                            <span className={styles.userStatus}>• En ligne</span>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarContent}>
                    <div className={styles.searchWrapper}>
                        <Search size={14} />
                        <input 
                            type="text"
                            placeholder="Aller à..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className={styles.navSection}>
                        <div className={styles.sectionHeader}>
                            <span>GROUPES & CLASSES</span>
                        </div>
                        <div className={styles.sectionList}>
                            {filteredGroups.map(groupe => (
                                <div key={groupe.id} className={styles.groupContainer}>
                                    <button 
                                        onClick={() => setSelectedGroup(groupe)}
                                        className={`${styles.groupRow} ${selectedGroup?.id === groupe.id ? styles.activeGroup : ''}`}
                                    >
                                        <Users size={14} />
                                        <span>{groupe.nom}</span>
                                        <ChevronRight size={12} className={selectedGroup?.id === groupe.id ? styles.rotated : ''} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {selectedGroup?.id === groupe.id && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={styles.channelList}
                                            >
                                                {channels.map(channel => (
                                                    <button 
                                                        key={channel.id}
                                                        onClick={() => setSelectedChannel(channel)}
                                                        className={`${styles.channelRow} ${selectedChannel?.id === channel.id ? styles.activeChannel : ''}`}
                                                    >
                                                        <Hash size={14} />
                                                        <span>{channel.name}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area - Modern Clean Style */}
            <div className={styles.chatArea}>
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        {selectedChannel ? (
                            <>
                                <div className={styles.headerTitle}>
                                    <Hash size={20} />
                                    <h4>{selectedChannel.name}</h4>
                                </div>
                                <div className={styles.headerMeta}>
                                    <span>{selectedGroup?.nom}</span>
                                    <span className={styles.separator}>•</span>
                                    <span>Liste des messages</span>
                                </div>
                            </>
                        ) : (
                            <div className={styles.headerTitle}>
                                <MessageSquare size={20} />
                                <h4>Sélectionnez une discussion</h4>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.messageList}>
                    {!selectedChannel ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <MessageSquare size={48} strokeWidth={1} />
                            </div>
                            <h2>Bienvenue dans votre messagerie</h2>
                            <p>Choisissez un groupe et un canal dans la barre latérale pour commencer à discuter avec vos étudiants.</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className={styles.emptyChannel}>
                            <div className={styles.channelIntro}>
                                <div className={styles.introHash}><Hash size={32} /></div>
                                <h1>Bienvenue au début du canal #{selectedChannel.name}</h1>
                                <p>C'est le début de l'histoire de ce canal. Envoyez un message pour lancer la discussion !</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.user_id === currentUserId;
                            return (
                                <div key={msg.id} className={`${styles.messageItem} ${isMe ? styles.isMe : ''}`}>
                                    <div className={styles.msgAvatar}>
                                        {msg.user?.prenom?.[0] || 'U'}{msg.user?.nom?.[0] || ''}
                                    </div>
                                    <div className={styles.msgContent}>
                                        <div className={styles.msgHeader}>
                                            <span className={styles.msgAuthor}>{isMe ? 'Vous' : `${msg.user?.prenom} ${msg.user?.nom}`}</span>
                                            <span className={styles.msgTime}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={styles.msgBubble}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {selectedChannel && (
                    <div className={styles.inputArea}>
                        <form onSubmit={handleSendMessage} className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Envoyer un message dans #${selectedChannel.name}`}
                                required
                            />
                            <div className={styles.inputActions}>
                                <button type="submit" disabled={!newMessage.trim() || loadingMessages} className={styles.sendButton}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
