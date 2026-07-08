import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Styled confirmation modal matching site theme (replaces window.confirm).
 * Uses the Premium Design System defined in components.css.
 */
const ConfirmModal = ({
    show,
    title = 'Confirmation',
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    variant = 'danger',
    confirmLoading = false,
}) => {
    if (!show) return null;

    const confirmBtnClass = variant === 'danger' ? 'btn-danger' : 'btn-primary';

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div 
                className="modal-card animate__animated animate__zoomIn animate__faster" 
                onClick={(e) => e.stopPropagation()}
                style={{ borderTop: `4px solid var(--admin-${variant === 'danger' ? 'danger' : 'accent'})` }}
            >
                <div className="modal-header">
                    <h2 className="d-flex align-items-center gap-2">
                        <AlertCircle 
                            size={20} 
                            color={variant === 'danger' ? 'var(--admin-danger)' : 'var(--admin-accent)'} 
                        />
                        {title}
                    </h2>
                    <button 
                        type="button" 
                        className="action-dropdown-btn" 
                        onClick={onCancel}
                        style={{ marginTop: '-8px', marginRight: '-8px' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body py-2">
                    <p style={{ color: 'var(--admin-text-muted)', margin: 0, lineHeight: '1.6' }}>
                        {message}
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={confirmLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={`btn ${confirmBtnClass}`}
                        onClick={onConfirm}
                        disabled={confirmLoading}
                    >
                        {confirmLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                Chargement...
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
