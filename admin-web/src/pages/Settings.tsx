import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  active: boolean;
  phone?: string;
  account_name?: string;
  qr_image?: string;
  instructions?: string;
}

const Settings: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({});
  const [uploadingQR, setUploadingQR] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/payment-methods`);
      setMethods(response.data);
    } catch (error) {
      toast.error('Error cargando métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setFormData(method);
  };

  const handleSave = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/payment-methods/${id}`, formData);
      toast.success('Método actualizado correctamente');
      loadPaymentMethods();
      setEditingId(null);
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQR(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/payment-methods/upload-qr`,
        formDataUpload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setFormData(prev => ({ ...prev, qr_image: response.data.image_url }));
      toast.success('QR subido correctamente');
    } catch (error) {
      toast.error('Error al subir QR');
    } finally {
      setUploadingQR(false);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Yape': return '💸';
      case 'Plin': return '💳';
      case 'Contra Entrega': return '💵';
      default: return '💰';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración de Métodos de Pago</h1>
        <p className="text-gray-600">Gestiona los métodos de pago disponibles para tus clientes</p>
      </div>

      <div className="grid gap-6">
        {methods.map((method) => (
          <div key={method.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getIcon(method.name)}</span>
                <div>
                  <h3 className="text-lg font-semibold">{method.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${method.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {method.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              {editingId === method.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(method.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(method)}
                  className="px-4 py-2 bg-coffee-600 text-white rounded hover:bg-coffee-700"
                >
                  Editar
                </button>
              )}
            </div>

            {editingId === method.id ? (
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Activar este método de pago</span>
                </label>

                {method.type === 'digital' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Teléfono
                      </label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="999 999 999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Titular
                      </label>
                      <input
                        type="text"
                        value={formData.account_name || ''}
                        onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código QR
                      </label>
                      {formData.qr_image && (
                        <img
                          src={formData.qr_image}
                          alt="QR Code"
                          className="w-48 h-48 object-contain mb-2 border rounded"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingQR}
                        className="block w-full text-sm"
                      />
                      {uploadingQR && <p className="text-sm text-gray-500 mt-1">Subiendo...</p>}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrucciones para el cliente
                  </label>
                  <textarea
                    value={formData.instructions || ''}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                    placeholder="Instrucciones de pago..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-600">
                {method.phone && <p>📱 Teléfono: {method.phone}</p>}
                {method.account_name && <p>👤 Titular: {method.account_name}</p>}
                {method.instructions && <p>📝 {method.instructions}</p>}
                {method.qr_image && (
                  <img
                    src={method.qr_image}
                    alt="QR"
                    className="w-32 h-32 object-contain border rounded mt-2"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;