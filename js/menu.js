import Sprite from './sprite.js';
import {
  handleInput,
  resource,
  toggleMusic
} from './util.js';

class Menu {
  constructor(width, height, animations) {
    this.showMenu = 0;
    this.height = height;
    this.state = 'title';
    this.width = width;
    this.menuY = 0;
    this.menuX = 1;
    this.updateTime = 10 / 60;
    this.updateAnimationsTime = 20 / 120;
    this.menuPhrase = {
      0: '音量大小',
      1: '選擇場景',
      2: '遊戲開始'
    };
    this.menu = {
      0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      1: ['城市', '太空'],
      2: ['GO']
    };
    this.selectedOptions = {
      0: '5',
      1: '城市',
      2: 'GO'
    };
    this.arrowUpBlink = 0;
    this.arrowDownBlink = 0;
    this.menuTitle = { pos: 0, direction: 1 };
    this.animations = animations;
    this.lastOperationTime = null; // 在构造函数中添加此行，用于存储上次操作的时间
    this.operationInterval = 5; // 操作间隔，根据实际情况调整
  }

  // adjustTheme() {
  //   if (this.selectedOptions[2] === 'novato') return 0.87;
  //   if (this.selectedOptions[2] === 'corredor') return 0.935;
  //   return 1;
  // }

  // startRace(player, road, opponents, director) {
  //   const roadParam = road;
  //   const zero = 0;
  //   drivers.forEach((driver) => opponents.push(new Opponent(
  //     driver.power * this.adjustDifficulty(),
  //     startPosition(tracks[this.selectedOptions[zero]].trackSize, driver.position),
  //     driver.trackSide, 'opponents', driver.name, driver.carColor,
  //   )));

  //   opponents.forEach((opponentNumber) => opponentNumber.create());
  //   opponents.splice(this.selectedOptions[1], opponents.length);
  //   roadParam.trackName = this.selectedOptions[zero];
  //   roadParam.create();
  //   player.create(this, tracks[this.selectedOptions[zero]].trackSize);
  //   director.create(road, this.selectedOptions[0]);
  // }
  
  update() {
    const {
      arrowup, arrowdown, arrowleft, arrowright,
    } = handleInput.map;
    const maxX = Object.keys(this.menu).length - 1;
    const maxY = this.menu[this.menuX].length - 1;
    const lastMenuOption = Object.keys(this.menu).length - 1;
  
    if (handleInput.mapPress.enter && !this.showMenu) {
      toggleMusic('event', 'musicOn');
      this.showMenu = 1;
      this.menuTitle.pos = 0;
      handleInput.mapPress.enter = false;
    }
  
    if (this.showMenu) {
      const now = Date.now();
      if (!this.lastOperationTime || now - this.lastOperationTime >= this.operationInterval) {
        this.lastOperationTime = now; 
  
        if (!arrowdown) this.arrowDownBlink = false;
        if (!arrowup) this.arrowUpBlink = false;
  
        if (arrowdown) {
          this.arrowDownBlink = !this.arrowDownBlink;
          if (this.menuX < maxX) {
            this.menuX += 1;
          } else {
            this.menuX = 0;
          }
          this.menuY = this.menu[this.menuX]
            .findIndex((item) => item === this.selectedOptions[this.menuX]);
        }
  
        if (arrowup) {
          this.arrowUpBlink = 1;
          if (this.menuX > 0) {
            this.menuX -= 1;
          } else {
            this.menuX = maxX;
          }
          this.menuY = this.menu[this.menuX]
            .findIndex((item) => item === this.selectedOptions[this.menuX]);
        }
  
        if (this.menuY < maxY && arrowright) this.menuY += 1;
        else if (this.menuY === maxY && arrowright) this.menuY = 0;
  
        if (this.menuY > 0 && arrowleft) this.menuY -= 1;
        else if (this.menuY === 0 && arrowleft) this.menuY = maxY;
    
        if (this.menuX !== lastMenuOption) {
          this.selectedOptions[this.menuX] = this.menu[this.menuX][this.menuY];
          handleInput.mapPress.enter = false;
        }
      }

      if (handleInput.mapPress.enter && this.menuX === lastMenuOption) {
        // const pauseBtn = document.querySelector('#pauseBtn');
        // const mute = document.querySelector('#mute');
        // pauseBtn.classList.toggle('hidden');
        // mute.classList.toggle('hidden');
        // const okBtn = document.querySelector('.rightControls').firstElementChild;
        // okBtn.classList.toggle('hidden');
        if(this.selectedOptions[1] === '城市'){
          this.state = '城市';
        }
        else if(this.selectedOptions[1] === '太空'){
          this.state = '太空';
        }
        handleInput.mapPress.enter = false;
      }
    }
  }

  // static drawButtons(render, x, y, size, text) {
  //   render.drawCircle(x, y + 3, size, 0, Math.PI * 2);
  //   render.drawText('black', text, x, y, 1.3, 'MicrosoftYahei', 'center');
  // }

  render(render) {
    const canvasWidth = 3840;
    const canvasHeight = 2160;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const scaleX = canvasWidth / 640;
    const scaleY = canvasHeight / 360;
  
    this.animations.forEach((item) => item.render(render));
    render.drawText('#000053', 'CabinGPT Demo', centerX, canvasHeight * 0.11, 3 * scaleX, 'RaceSport');
  
    if (!this.showMenu) {
      if (this.menuTitle.pos >= 12) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -12) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      if (window.navigator.maxTouchPoints) {
        render.drawText('black', '歡迎體驗新世代的智慧座艙系統', centerX, centerY + this.menuTitle.pos * scaleY, 2 * scaleX);
      } else {
        render.drawText('black', '歡迎體驗新世代的智慧座艙系統', centerX, centerY + this.menuTitle.pos * scaleY, 2 * scaleX);
        render.drawText('black', 'Press Enter', centerX, centerY + 50 * scaleY, 1 * scaleX);
      }
    }
  
    if (this.showMenu) {
      if (this.menuTitle.pos >= 4) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -4) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 >= 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 <= maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[menuLow]} ${this.selectedOptions[menuLow]}`;
      const highText = `${this.menuPhrase[menuHigh]} ${this.selectedOptions[menuHigh]}`;
  
      render.roundRect('#2C69EB', canvasWidth * 0.15, canvasHeight * 0.25, canvasWidth * 0.7, canvasHeight * 0.47, 20 * scaleX, true, false);
      render.drawText('#FFFAF4', lowText, centerX, centerY - 45 * scaleY, 1.6 * scaleX);
      const phrase = `${this.menuPhrase[this.menuX]} ${this.menu[this.menuX][this.menuY]}`;
      render.drawText('#050B1A', phrase, centerX, centerY + (this.menuTitle.pos) * scaleY, 1.6 * scaleX, 'MicrosoftYaheiBold');
      render.drawText('#FFFAF4', highText, centerX, centerY + 45 * scaleY, 1.6 * scaleX);
  
      if (window.navigator.maxTouchPoints) {
        const buttonStartX = canvasWidth * 0.22;
        const buttonGap = canvasWidth * 0.062;
        const buttonY = canvasHeight * 0.86;
        const buttonTextY = canvasHeight * 0.95;
        const buttonRadius = 15 * scaleX;
      
        Menu.drawButtons(render, buttonStartX, buttonY, buttonRadius, 'U');
        Menu.drawButtons(render, buttonStartX + buttonGap, buttonY, buttonRadius, 'D');
        Menu.drawButtons(render, buttonStartX + buttonGap * 2, buttonY, buttonRadius, 'L');
        Menu.drawButtons(render, buttonStartX + buttonGap * 3, buttonY, buttonRadius, 'R');
        
        render.drawText('black', 'Navegar', buttonStartX, buttonTextY, 1.3 * scaleX, 'MicrosoftYahei', 'left');
      
        const okButtonX = canvasWidth * 0.65;
        Menu.drawButtons(render, okButtonX, buttonY, buttonRadius * 1.2, 'OK');
        
        const confirmTextX = canvasWidth * 0.81;
        render.drawText('black', 'Confirmar', confirmTextX, buttonTextY, 1.3 * scaleX, 'MicrosoftYahei', 'right');
      } else {
        const arrowKeys = new Sprite();
        arrowKeys.image = resource.get('arrowKeys');
        arrowKeys.name = 'mnArrowKeys';
      
        const enterKey = new Sprite();
        enterKey.image = resource.get('enterKey');
        enterKey.name = 'mnEnterKey';
      
        const textX = canvasWidth * 0.92;
        const textY1 = canvasHeight * 0.88;
        const textY2 = canvasHeight * 0.95;
        const buttonY = canvasHeight * 0.85;
        const buttonTextY = canvasHeight * 0.93;
        const imageSize = 18 * scaleX;
      
        render.drawText('black', '控制', textX, textY1, 1.3 * scaleX, 'MicrosoftYahei', 'right');
        render.renderingContext.drawImage(arrowKeys.image, textX + 5 * scaleX, buttonY, imageSize, imageSize);
        render.drawText('black', '確認', textX, textY2, 1.3 * scaleX, 'MicrosoftYahei', 'right');
        render.renderingContext.drawImage(enterKey.image, textX + 7 * scaleX, buttonTextY, imageSize - 5 * scaleX, imageSize);
      }      
  
    }
  }  
}

export default Menu;
