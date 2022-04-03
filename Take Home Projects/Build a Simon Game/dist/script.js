// Hacked by Ry2uko ;}
const constants = {
  controlsActive: '#d9dff2',
  greenActive: '#13ff7c',
  redActive: '#ff4c4c',
  yellowActive: '#fed93f',
  blueActive: '#1c8cff',
  greenInactive: '#00A74A',
  redInactive: '#9F0F17',
  yellowInactive: '#CCA707',
  blueInactive: '#094A8F',
  countActive: '#DC0D29',
  countInactive: '#430710' };


const Tiles = {
  lightAll: (g, r, y, b, ms = 350) => {
    g.css('backgroundColor', constants.greenActive);
    r.css('backgroundColor', constants.redActive);
    y.css('backgroundColor', constants.yellowActive);
    b.css('backgroundColor', constants.blueActive);

    setTimeout(() => {
      g.css('backgroundColor', constants.greenInactive);
      r.css('backgroundColor', constants.redInactive);
      y.css('backgroundColor', constants.yellowInactive);
      b.css('backgroundColor', constants.blueInactive);
    }, ms);
  },
  lightSequence: (sequence, seqCount, component) => {
    component.setState({ tileLock: true, currSeq: 0 });
    $('.color-tile').css('cursor', 'default');
    let ms = component.state.ms,
    vol = 0.75;

    return new Promise((resolve, reject) => {
      let count = 0;
      function lightTile() {
        if (count === seqCount) {
          resolve();
          component.setState({ tileLock: false });
          $('.color-tile').css('cursor', 'pointer');
          clearInterval(interval);
          return;
        }
        switch (sequence[count]) {
          case 'g':
            Tiles.lightGreen(component, ms, vol);
            break;
          case 'r':
            Tiles.lightRed(component, ms, vol);
            break;
          case 'y':
            Tiles.lightYellow(component, ms, vol);
            break;
          case 'b':
            Tiles.lightBlue(component, ms, vol);}


        count++;
      }

      lightTile();
      const interval = setInterval(lightTile, ms + 500);
    });
  },
  lightGreen: (component, ms, vol) => {
    const greenTile = $('.color-tile#green');

    greenTile.css('backgroundColor', constants.greenActive);
    $('#gAudio')[0].play();
    $('#gAudio')[0].volume = vol;

    setTimeout(() => {
      $('#gAudio')[0].pause();
      $('#gAudio')[0].currentTime = 0;
      greenTile.css('backgroundColor', constants.greenInactive);
    }, ms);
    return;
  },
  lightRed: (component, ms, vol) => {
    const redTile = $('.color-tile#red');

    redTile.css('backgroundColor', constants.redActive);
    $('#rAudio')[0].play();
    $('#rAudio')[0].volume = vol;

    setTimeout(() => {
      $('#rAudio')[0].pause();
      $('#rAudio')[0].currentTime = 0;
      redTile.css('backgroundColor', constants.redInactive);
    }, ms);
    return;
  },
  lightYellow: (component, ms, vol) => {
    const yellowTile = $('.color-tile#yellow');

    yellowTile.css('backgroundColor', constants.yellowActive);
    $('#yAudio')[0].play();
    $('#yAudio')[0].volume = vol;

    setTimeout(() => {
      $('#yAudio')[0].pause();
      $('#yAudio')[0].currentTime = 0;
      yellowTile.css('backgroundColor', constants.yellowInactive);
    }, ms);
    return;
  },
  lightBlue: (component, ms, vol) => {
    const blueTile = $('.color-tile#blue');

    blueTile.css('backgroundColor', constants.blueActive);
    $('#bAudio')[0].play();
    $('#bAudio')[0].volume = vol;

    setTimeout(() => {
      $('#bAudio')[0].pause();
      $('#bAudio')[0].currentTime = 0;
      blueTile.css('backgroundColor', constants.blueInactive);
    }, ms);
    return;
  } };

const State = {
  generateSequence: (sequenceLength = 20) => {
    const sequence = [];
    const availableSeq = ['g', 'r', 'y', 'b'];
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(availableSeq[Math.floor(Math.random() * 4)]);
    }
    return sequence;
  },
  formatInt: int => {
    let intToStr = int.toString();
    if (int < 10) {
      intToStr = '0' + intToStr;
    }
    return intToStr;
  } };


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transitionLock: false,
      tileLock: true,
      strictMode: false,
      sequence: [],
      seqCount: 0,
      sequenceCount: '',
      currSeq: 0,
      ms: 400 };


    this.startGame = this.startGame.bind(this);
    this.winFlash = this.winFlash.bind(this);
    this.errFlash = this.errFlash.bind(this);
  }

  componentDidMount() {
    const component = this;
    const greenTile = $('.color-tile#green');
    const redTile = $('.color-tile#red');
    const yellowTile = $('.color-tile#yellow');
    const blueTile = $('.color-tile#blue');

    $('#start-header').on('click', () => {
      if (this.state.transitionLock) return;
      component.setState({ transitionLock: true });

      Tiles.lightAll(greenTile, redTile, yellowTile, blueTile);
      $('#controls').css('backgroundColor', constants.controlsActive);
      $('#start-header').fadeOut(600, () => {
        this.setState({ transitionLock: false });
        $('#cStrict').fadeIn(400);
      });
    });
    $('button.option').on('click', e => {
      if (this.state.transitionLock) return;
      component.setState({
        transitionLock: true,
        strictMode: $(e.target).attr('id') === 'yes' });

      $('#cStrict').fadeOut(400, () => {
        $('#controls').addClass('flex-stretch');
        $('#cGame').fadeIn(600, () => {
          component.setState({ transitionLock: false });
          component.startGame(true);
        });
      });
    });
    $('div.color-tile').on('click', async e => {
      if (component.state.tileLock) return;
      let tileName = $(e.target).attr('id'),
      ms = this.state.ms - 80,vol = 0.75;

      tileName = tileName.charAt(0).toUpperCase() + tileName.slice(1);

      Tiles[`light${tileName}`](this, ms, vol);
      const correctSeq = component.state.sequence[component.state.currSeq];
      const gotSeq = tileName[0].toLowerCase();

      gotSeq === correctSeq ?
      component.winFlash(component) :
      component.errFlash(component);
    });
  }

  startGame(init = false) {
    const component = this;

    async function start() {
      const sequence = State.generateSequence();
      component.setState({ sequence });

      await Tiles.lightSequence(component.state.sequence, component.state.seqCount, component);
    }

    function lightCount() {
      const countQuery = $('#count');
      countQuery.css('color', constants.countActive);
      setTimeout(() => {
        countQuery.css('color', constants.countInactive);
        return;
      }, 720);
    }

    if (init) {
      setTimeout(() => {
        let intervalCount = 0;
        function intervalFoo() {
          if (intervalCount === 3) {
            clearInterval(interval);
            $('#count').css('color', constants.countActive);
            component.setState({
              seqCount: 1,
              sequenceCount: State.formatInt(1) });


            setTimeout(start, 1000);
            return;
          }
          lightCount();
          intervalCount++;
        }
        intervalFoo();
        const interval = setInterval(intervalFoo, 1520);
      }, 400);
    } else {
      start();
    }
  }

  winFlash() {
    let newSeq = this.state.currSeq + 1;
    let sequence = this.state.sequence;
    this.setState({
      currSeq: newSeq });


    if (newSeq !== this.state.seqCount) return;
    this.setState({ tileLock: true });
    $('.color-tile').css('cursor', 'default');

    const countQuery = $('#count');

    if (newSeq === 20) {
      const greenTile = $('.color-tile#green');
      const redTile = $('.color-tile#red');
      const yellowTile = $('.color-tile#yellow');
      const blueTile = $('.color-tile#blue');
      countQuery.css('color', constants.countInactive);
      this.setState({ tileLock: true });
      setTimeout(() => {
        this.setState({ sequenceCount: ':)' });
        countQuery.css('color', constants.countActive);
        Tiles.lightAll(greenTile, redTile, yellowTile, blueTile, 2000);
        setTimeout(() => {
          countQuery.css('color', constants.countInactive);
          this.setState({ sequenceCount: '--' });
        }, 2000);
      }, 1000);
      return;
    }

    newSeq++;
    setTimeout(() => {
      setTimeout(() => {
        countQuery.css('color', constants.countInactive);
      }, 100);

      setTimeout(async () => {
        await Tiles.lightSequence(sequence, newSeq, this);
        this.setState({
          seqCount: newSeq,
          sequenceCount: State.formatInt(newSeq) });

        countQuery.css('color', constants.countActive);
      }, 1000);
    }, 500);
  }

  errFlash() {
    this.setState({ tileLock: true });
    $('.color-tile').css('cursor', 'default');
    const countQuery = $('#count');
    let sequence = this.state.sequence,
    seqCount = this.state.seqCount;
    this.setState({
      sequenceCount: ':(' });


    setTimeout(() => {
      countQuery.css('color', constants.countInactive);
      let strSeqCount;

      this.state.strictMode ?
      strSeqCount = '' :
      strSeqCount = State.formatInt(seqCount);

      this.setState({
        sequenceCount: strSeqCount });


      setTimeout(async () => {
        if (this.state.strictMode) {
          this.setState({
            tileLock: true,
            sequence: [],
            seqCount: 1,
            sequenceCount: '01',
            currSeq: 0 });

          this.startGame();
          countQuery.css('color', constants.countActive);
        } else {
          await Tiles.lightSequence(sequence, seqCount, this);
          countQuery.css('color', constants.countActive);
        }
      }, 1000);
    }, 2000);

  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "game-container" }, /*#__PURE__*/
      React.createElement("audio", { src: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", type: "audio/mpeg", id: "gAudio" }), /*#__PURE__*/
      React.createElement("audio", { src: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", type: "audio/mpeg", id: "rAudio" }), /*#__PURE__*/
      React.createElement("audio", { src: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", type: "audio/mpeg", id: "yAudio" }), /*#__PURE__*/
      React.createElement("audio", { src: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3", type: "audio/mpeg", id: "bAudio" }), /*#__PURE__*/

      React.createElement("div", { id: "simon-game" }, /*#__PURE__*/
      React.createElement("div", { className: "color-tile", id: "green" }), /*#__PURE__*/
      React.createElement("div", { className: "color-tile", id: "red" }), /*#__PURE__*/
      React.createElement("div", { className: "color-tile", id: "yellow" }), /*#__PURE__*/
      React.createElement("div", { className: "color-tile", id: "blue" }), /*#__PURE__*/
      React.createElement("div", { id: "controls" }, /*#__PURE__*/
      React.createElement("h4", { id: "start-header" }, "Click Here to Start"), /*#__PURE__*/
      React.createElement("div", { id: "cStrict" }, /*#__PURE__*/
      React.createElement("h4", { id: "strict-header" }, "Do you want to enable strict mode?"), /*#__PURE__*/
      React.createElement("div", { className: "strict-options" }, /*#__PURE__*/
      React.createElement("button", { className: "option", id: "yes" }, "Yes"), /*#__PURE__*/
      React.createElement("button", { className: "option", id: "no" }, "No"))), /*#__PURE__*/


      React.createElement("div", { id: "cGame" }, /*#__PURE__*/
      React.createElement("h4", { id: "game-header" }, "Simon\xAE"), /*#__PURE__*/
      React.createElement("div", { className: "count-container" }, /*#__PURE__*/
      React.createElement("span", { id: "count" }, this.state.sequenceCount ? this.state.sequenceCount : '--')))))));






  }}


ReactDOM.render( /*#__PURE__*/
React.createElement(Game, null),
document.getElementById('root'));