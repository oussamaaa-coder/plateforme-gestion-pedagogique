import React from 'react';
import { useAuth } from '../../admin/context/AuthContext';
import ChatSystem from '../../core/components/chat/ChatSystem';
import PageHeader from '../../core/components/ui/PageHeader';
import { MessageSquare } from 'lucide-react';
import styles from './FormateurClasses.module.css'; // Reusing pageWrapper/pageBody logic

export default function FormateurDiscussions() {
    const { user } = useAuth();

    return (
        <div className={styles.pageWrapper}>
            <PageHeader 
                breadcrumb={[{ label: 'Tableau de bord', path: '/formateur' }, { label: 'Discussions' }]}
                title="Messagerie & Discussions"
                subtitle="Communiquez en temps réel avec vos groupes et collègues."
                icon={<MessageSquare size={24} />}
            />
            
            <div className={styles.pageBody} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                    flex: 1, 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    minHeight: '600px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                }}>
                    <ChatSystem currentUserRole="formateur" currentUserId={user?.id} />
                </div>
            </div>
        </div>
    );
}
