import React from 'react';
import { useAuth } from '../../admin/context/AuthContext';
import ChatSystem from '../../core/components/chat/ChatSystem';

export default function StudentDiscussions() {
    const { user } = useAuth();

    return (
        <div className="h-[calc(100vh-140px)] min-h-[600px] bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
            <ChatSystem currentUserRole="etudiant" currentUserId={user?.id} />
        </div>
    );
}

