function ConfirmModal({ isOpen, message, onCancel, onConfirm }) {
    if (!isOpen) return null; 

    return (
        <div className="confirmOverlay">
            <div className="confirmModal">
                <h3 style={{ marginTop: 0 }}>Confirmación</h3>
                <p>{message}</p>

                <div className="confirmActions">
                <button className="btn" onClick={onCancel}>
                    Cancelar
                </button>
                <button className="btn btnDanger" onClick={onConfirm}>
                    Confirmar
                </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;