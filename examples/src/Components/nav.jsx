import React from 'react';

function Nav() {
  return (
    <div
      style={{
        height: '100px',
        position: 'fixed',
        display: 'flex',
        // flexWrap: 'wrap',
        // flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // margin: 'auto',
        // marginLeft: 'auto',
        // marginRight: 'auto',
        // fontFamily: 'Arial, Helvetica, sans-serif',
        letterSpacing: '1px',
        zIndex: 10000,
      }}
      id='nav'
    >
      <div
        style={{ display: 'flex', alignItems: 'center', marginLeft: '30px' }}
      >
        <a href='https://www.eddie-wang.dev/' style={{ margin: '0 50px 0 0' }}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='36'
            height='36'
            fill='#66fcf1'
            className='icon'
            viewBox='0 0 24 24'
          >
            <path d='M4,10V21h6V15h4v6h6V10L12,3Z' />
          </svg>
        </a>
        <h2 style={{ color: 'rgb(212 212 212)' }}>PROJECTS & EXAMPLES</h2>
      </div>

      <div style={{ position: 'relative', right: '0px' }} className='Icons'>
        <a href='https://github.com/eddie246' target='_blank'>
          <button className='learn-more'>
            <span className='circle' aria-hidden='true'>
              <span className='icon arrow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='#1f2833'
                  className='icon'
                  viewBox='0 0 16 16'
                >
                  <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
                </svg>
              </span>
            </span>
            <span className='button-text'>GitHub</span>
          </button>
        </a>
        <a href='https://www.linkedin.com/in/eddie-wang2/' target='_blank'>
          <button className='learn-more'>
            <span className='circle' aria-hidden='true'>
              <span className='icon arrow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='#1f2833'
                  className='icon'
                  viewBox='0 0 16 16'
                >
                  <path d='M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z' />
                </svg>
              </span>
            </span>
            <span className='button-text'>LinkedIn</span>
          </button>
        </a>
        <a href='https://www.linkedin.com/in/eddie-wang2/' target='_blank'>
          <button className='learn-more'>
            <span className='circle' aria-hidden='true'>
              <span className='icon arrow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='#1f2833'
                  className='icon'
                  viewBox='0 0 24 24'
                >
                  <path d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z' />
                </svg>
              </span>
            </span>
            <span className='button-text'>Twitter</span>
          </button>
        </a>
      </div>
      <div id='menu' style={{ alignItems: 'center', marginRight: '30px' }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='36'
          height='36'
          fill='#66fcf1'
          viewBox='0 0 24 24'
        >
          <path d='M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z' />
        </svg>
      </div>
    </div>
  );
}

export default Nav;
