import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import APIService from '../../api_connector';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import './../../App.css';
import './AdminPanel.css';

const AdminPanel = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const { state } = useLocation();
  const userId = state && state.userId;
  const userName = state && state.userName;
  const navigate = useNavigate();

  const connector = new APIService();

  useEffect(() => {
    if (userId) {
      connector.getServers(userId)
        .then((body) => {
          if (Array.isArray(body)) {
            setServers(body);
          } else {
            setServers([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
      connector.getUpdates()
        .then((body) => {
          if (Array.isArray(body)) {
            setUpdates(body);
          } else {
            setUpdates([]);
          }
        })
        .catch(() => {
        });
  }, []);

  const handleScheduleUpdates = async () => {
    if (selectedServer && selectedDate) {
        const serverGuid = selectedServer.guid;
        const dateTime = new Date(selectedDate[serverGuid]);
        const dateTimeString = new Date(dateTime.getTime()).toISOString();

        try {
            await connector.addInstallation(serverGuid, selectedUpdate, dateTimeString);
            setConfirmationVisible(true);
            setTimeout(() => {
              setConfirmationVisible(false);
            }, 3000);
          } catch (error) {
            console.error('Не удалось: ', error);
          }
      } else {
        console.log('Не удалось: недостаточно данных для планирования');
      }
  };

  const handleDateTimeChange = (date, server) => {
    setSelectedDate((prevState) => ({
      ...prevState,
      [server.guid]: date,
    }));
    setButtonDisabled(date == null);
  };

  const handleServerSelect = (server) => {
    if (server) {
      setSelectedServer(server);
      setSelectedDate({ ...selectedDate, [server.guid]: null });
    }
    setButtonDisabled(true);
    const defaultUpdate = updates.find((update) => update.os === server.os);
    setSelectedUpdate(defaultUpdate ? defaultUpdate.id : '');
  };

  const handleSignOut = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="admin-panel">
        <a href="#" className="sign-out" onClick={handleSignOut}>Разлогиниться</a>
        <h2>Ваши серверы, господин {userName}</h2>
      {loading ? (
        <div>Загружается...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Название</th>
              <th>GUID</th>
              <th>IP</th>
              <th>ОС</th>
              <th>Обновление</th>
              <th>Дата и время</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server) => (
              <tr key={server.guid}>
                <td>
                <input
                    type="radio"
                    name="selectedServer"
                    value={server.guid}
                    checked={selectedServer === server}
                    onChange={() => handleServerSelect(server)}
                  />
                </td>
                <td>{server.name}
                    <div className="updates-link"><a href={'/installations/'+server.guid}>Обновления</a></div>
                </td>
                <td>{server.guid}</td>
                <td>{server.ip}</td>
                <td>{server.os}</td>
                <td>
                  <select 
                    onChange={(e) => setSelectedUpdate(e.target.options[e.target.selectedIndex].getAttribute('data-id'))} 
                    disabled={!selectedServer || selectedServer !== server}>
                        {updates
                        .filter((update) => update.os === server.os)
                        .map((update) => (
                            <option key={update.id} data-id={update.id} value={update.name}>
                            {update.name}
                            </option>
                        ))}
                  </select>
                </td>
                <td>
                  <DatePicker
                    selected={selectedDate ? selectedDate[server.guid] : null}
                    onChange={(date) => handleDateTimeChange(date, server)}
                    minDate={new Date()}
                    minTime={ (selectedDate && !selectedDate[server.guid]) ||
                        (selectedDate && selectedDate[server.guid] && isToday(selectedDate[server.guid]))
                          ? new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes()))
                          : undefined
                      }
                      maxTime={ (selectedDate && !selectedDate[server.guid]) ||
                        (selectedDate && selectedDate[server.guid] && isToday(selectedDate[server.guid]))
                          ? new Date(new Date().setHours(23, 59))
                          : undefined
                      }                    
                    showTimeSelect
                    dateFormat="Pp"
                    timeFormat="HH:mm"
                    locale={ru}
                    disabled={!selectedServer || selectedServer !== server}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={handleScheduleUpdates}
        disabled={buttonDisabled}
        className={buttonDisabled ? 'plan-button disabled-button' : 'plan-button'}
      >Запланировать обновление</button>
      {confirmationVisible && (
        <div className="confirmation-message">Обновление успешно запланировано!</div>
      )}
    </div>
  );
};

export default AdminPanel;