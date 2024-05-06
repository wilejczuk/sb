import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import APIService from '../../api_connector';
import './../../App.css';

const Installations = () => {
  const { guid } = useParams();
  const [loading, setLoading] = useState(true);
  const [installations, setInstallations] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const navigate = useNavigate();

  const connector = new APIService();

  useEffect(() => {
    connector.getInstallations(guid)
      .then((body) => {
        if (Array.isArray(body)) {
          setInstallations(body);
        } else {
           setInstallations([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
}, [confirmationVisible]);

  const handleSignOut = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const cancelInstallation = async (id) => {
    try {
      await connector.cancelInstallation(id);
      setConfirmationVisible(true);
      setTimeout(() => {
        setConfirmationVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Не удалось: ', error);
    }
  };

  const convertDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    };
    return dateTime.toLocaleDateString("ru-RU", options);
  };

  const showStatuses = (status) => {
    switch (status) {
      case 'planned':
        return '⏰ Запланировано';
      case 'canceled':
        return '❌ Отменено';
      case 'installed':
        return '✅ Установлено';
      default:
        return '';
    }
  };

  return (
    <div className="admin-panel">
        <a href="#" className="sign-out" onClick={handleSignOut}>Разлогиниться</a>
        <h2>Сервер [GUID {guid}]</h2>
      {loading ? (
        <div>Загружается...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Обновление</th>
              <th>Статус</th>
              <th>Время</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {installations.length === 0 ? (
              <tr>
                <td colSpan="4">Обновлений пока не запланировано</td>
              </tr>
            ) : (
            installations.map((installation) => (
              <tr key={installation.id}>
                <td>{installation.name}</td>
                <td className="fixed-width">{showStatuses(installation.status)}</td>
                <td>{convertDateTime(installation.time)}</td>
                <td >
                  {installation.status === 'planned' && (
                    <button
                      onClick={() => cancelInstallation(installation.id)}
                      className="cancel-button"
                    >
                      Отменить
                    </button>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      )}
      {confirmationVisible && (
        <div className="confirmation-message">Обновление успешно отменено!</div>
      )}
    </div>
  );
};

export default Installations;