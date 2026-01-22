import { useState } from 'react';
// import './ModalAltaUsuario.css';

const ModalAltaUsuario = ({ open, onClose, onSubmit }) => {
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        usuario: '',
        estado: 'APROBADO',
    });

    const [driverData, setDriverData] = useState({
        dni: '',
        licencia: '',
        vencimientoLicencia: '',
        vencimientoSeguro: '',
        marca: '',
        modelo: '',
        año: '',
        numeroMotor: '',
        numeroChassis: '',
        tipoVehiculo: '',
    });

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDriverChange = (e) => {
        const { name, value } = e.target;
        setDriverData({ ...driverData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            userType,
            ...(userType === 'chofer' && driverData),
        };
        onSubmit(payload);
        resetForm();
    };

    const resetForm = () => {
        setUserType('');
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            usuario: '',
            estado: 'APROBADO',
        });
        setDriverData({
            dni: '',
            licencia: '',
            vencimientoLicencia: '',
            vencimientoSeguro: '',
            marca: '',
            modelo: '',
            año: '',
            numeroMotor: '',
            numeroChassis: '',
            tipoVehiculo: '',
        });
    };

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Dar de Alta Usuario</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Datos Personales */}
                    <fieldset>
                        <legend>Datos Personales</legend>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                    </fieldset>

                    {/* Tipo de Usuario */}
                    <fieldset>
                        <legend>Tipo de Usuario</legend>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="comun"
                                    checked={userType === 'comun'}
                                    onChange={handleUserTypeChange}
                                />
                                Usuario Común
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="chofer"
                                    checked={userType === 'chofer'}
                                    onChange={handleUserTypeChange}
                                />
                                Usuario Chofer
                            </label>
                        </div>
                    </fieldset>

                    {/* Datos del Chofer */}
                    {userType === 'chofer' && (
                        <>
                            <fieldset>
                                <legend>Documentación</legend>
                                <div className="form-group">
                                    <label>DNI</label>
                                    <input
                                        type="text"
                                        name="dni"
                                        value={driverData.dni}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Licencia</label>
                                    <input
                                        type="text"
                                        name="licencia"
                                        value={driverData.licencia}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Vencimiento Licencia</label>
                                    <input
                                        type="date"
                                        name="vencimientoLicencia"
                                        value={driverData.vencimientoLicencia}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Vencimiento Seguro</label>
                                    <input
                                        type="date"
                                        name="vencimientoSeguro"
                                        value={driverData.vencimientoSeguro}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                            </fieldset>

                            <fieldset>
                                <legend>Vehículo</legend>
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input
                                        type="text"
                                        name="marca"
                                        value={driverData.marca}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Modelo</label>
                                    <input
                                        type="text"
                                        name="modelo"
                                        value={driverData.modelo}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Año</label>
                                    <input
                                        type="number"
                                        name="año"
                                        value={driverData.año}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Número Motor</label>
                                    <input
                                        type="text"
                                        name="numeroMotor"
                                        value={driverData.numeroMotor}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Número Chasis</label>
                                    <input
                                        type="text"
                                        name="numeroChassis"
                                        value={driverData.numeroChassis}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tipo de Vehículo</label>
                                    <input
                                        type="text"
                                        name="tipoVehiculo"
                                        value={driverData.tipoVehiculo}
                                        onChange={handleDriverChange}
                                        required
                                    />
                                </div>
                            </fieldset>
                        </>
                    )}

                    {/* Botones */}
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit" disabled={!userType}>
                            Dar de Alta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAltaUsuario;