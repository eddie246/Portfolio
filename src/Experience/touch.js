import nipplejs from 'nipplejs';
export default class touchControls {
  constructor() {
    const body = document.body;
    body.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="joystick"></div>
      <div class="button">⇧</div>
      `
    );

    this.manager = nipplejs.create({
      zone: document.querySelector('.joystick'),
      // color: 'green',
      mode: 'static',
      position: { top: '50%', left: '50%' },
    });
  }
}
