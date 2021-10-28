import React from 'react';
import { render } from 'react-dom';
import './index.css';

import Nav from './Components/nav.jsx';
import Back from './Components/background.jsx';

const App = () => {
  return (
    <div>
      <Nav />
      {/* <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div>
      <div style={{ height: '100px' }}>TEST</div> */}
      <Back />
    </div>
  );
};

render(<App />, document.getElementById('root'));
