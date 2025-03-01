// src/App.js
import React from 'react';
import { ConfigProvider } from 'antd';
import CalendarComponent from './components/Calendar';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <CalendarComponent />
      </div>
    </ConfigProvider>
  );
}

export default App;