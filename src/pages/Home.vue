<template>
  <div id="home">
    <canvas id="canvas" ref="canvas" @mousedown="onMouseDown" class="canvas"></canvas>

    <popin v-if="popin" @close="popin=false">
      <button @click="onCreateSignal('triangle')">Triangulate</button>
      <button @click="onCreateSignal('sinus')">Sinus</button>
      <button @click="onCreateSignal('square')">Square</button>
      <button @click="onCreateSignal('composition')">Composition</button>
    </popin>

    <div class="gui">
      <div class="section">
        <details>
          <summary>Signals</summary>

          <div class="signal" v-for="(signal, i) in signals.filter(s => s.mode !== 'pwm')" :key="i">
            <p>{{ signal.mode }} {{ signal.id }}</p>

            <div v-if="signal.mode === 'composition'">
              <div class="param" >
                <label class="param__label">Signals</label>
                <select name="" id="" multiple @change="onSelect(signal.id, $event)">
                  <option 
                    v-for="(signal, index) in signals.filter(s => s.id !== signal.id )"
                    :key="index"
                    :value="signal.id">
                    {{ signal.mode }} {{ signal.id }}
                  </option>
                </select>
              </div>
               <div class="param" >
                <label class="param__label">Visible</label>
                <input 
                class="param__input" 
                @change="onChangeSignal(i)"
                type="checkbox" 
                v-model="signals[i].visible">
              </div>
              <div class="param" >
                <label class="param__label">Color</label>
                <input 
                class="param__input" 
                @input="onChangeSignal(i)"
                v-model="signals[i].color"
                type="color" >
              </div>
            </div>

            <div v-if="signal.mode !== 'composition'">
              <div class="param" >
                <label class="param__label">F(Hz)</label>
                <input
                  v-model="signals[i].freq"
                  class="param__input"
                  type="number"
                  min="1"
                  max="22000"
                  step="1"
                  @input="onChangeSignal(i)"
                  value="1">
              </div>
              <div class="param" >
                <label class="param__label">Threshold</label>
                <input
                  v-model="signals[i].treshold"
                  class="param__input"
                  type="number"
                  min="1"
                  max="22000"
                  step="1"
                  @input="onChangeSignal(i)"
                  value="1">
              </div>
              <div class="param" >
                <label class="param__label">Amp(V)</label>
                <input
                  v-model="signals[i].amp"
                  class="param__input" 
                  type="number" 
                  min="0" 
                  max="5" 
                  step="0.01"
                  @input="onChangeSignal(i)"
                  value="1">
              </div>
              <div class="param" >
                <label class="param__label">Visible</label>
                <input 
                class="param__input" 
                @change="onChangeSignal(i)"
                type="checkbox" 
                v-model="signals[i].visible">
              </div>
              <div class="param" >
                <label class="param__label">Color</label>
                <input 
                class="param__input" 
                @input="onChangeSignal(i)"
                v-model="signals[i].color"
                type="color" >
              </div>
            </div>

          </div>

          <button @click="onNewSignal">+</button>
        </details>
      </div>

      <div class="section">
        <details>
          <summary>PWM</summary>
          <div class="signal" v-for="(pwm, i) in pwms.filter(s => s.mode === 'pwm')" :key="'pwm'+i">
            <p>{{ pwm.mode }} {{ pwm.id }}</p>

            <div>
              <div class="param" >
                <label class="param__label">Signal</label>
                <select name="" id="" @change="onSelectPWMSignal(pwm.id, $event)">
                  <option value="" disabled selected></option>
                  <option 
                    v-for="(pwm, index) in signals.filter(s => s.id !== pwm.id )"
                    :key="'a'+index"
                    :value="pwm.id">
                    {{ pwm.mode }} {{ pwm.id }}
                  </option>
                </select>
              </div>
               <div class="param">
                <label class="param__label">Visible</label>
                <input 
                class="param__input" 
                @change="onChangePWM(i)"
                type="checkbox" 
                v-model="pwms[i].visible">
              </div>
              <div class="param" >
                <label class="param__label">Color</label>
                <input 
                class="param__input" 
                @input="onChangePWM(i)"
                v-model="pwms[i].color"
                type="color" >
              </div>
              <div class="param" >
                <label class="param__label">Res</label>
                <input 
                class="param__input" 
                @input="onChangePWM(i)"
                v-model="pwms[i].resolution"
                type="number" >
              </div>

              <div class="param" >
                <label class="param__label">Clock</label>
                <input 
                class="param__input" 
                @input="onChangePWM(i)"
                v-model="pwms[i].clocking"
                type="number" >
              </div>
              <div class="param" >
                <label class="param__label">Prescale</label>
                <input 
                class="param__input" 
                @input="onChangePWM(i)"
                v-model="pwms[i].prescaler"
                type="number" >
              </div>
            </div>
          </div>

          <button @click="onNewPWM">+</button>
        </details>
      </div>
    </div>
    <Information :infos="infos"/>
  </div>
</template>

<script>
import Oscilloscope from "../core/Oscilloscope";
import pinchableMixin from "../mixins/Pinchable"
import Signal from '@/core/Signal';
import PWM from "@/core/PWM";
import { sin, tri, squ } from "@/core/helper"
import Popin from "@/components/Popin"
import Information from "@/components/Information"

var id = 1;

export default {
  mixins: [pinchableMixin],

  data() {
    return {
      signals: [],
      pwms: [],
      infos: [],
      popin: false
    }
  },

  components: {
    Popin,
    Information,
  },

  mounted() {
    this.onResize();
    window.addEventListener('resize', () => {
      this.onResize()
    })
    this.oscilloscope = new Oscilloscope(this.$refs.canvas);
    this.$on('zoom', () => {
      this.oscilloscope.screen.setZoom(this.zoom)
      this.oscilloscope.draw();
    })
  },

  methods: {
    onResize() {
      this.$refs.canvas.width = window.innerWidth*2
      this.$refs.canvas.height = window.innerHeight*2
    },

    onNewSignal() {
      this.popin = true;
    },

    onNewPWM() {
      const signal = { 
        mode: 'pwm', 
        id: id++, 
        visible: true, 
        color: '#000000', 
        signal: null,
        lineWidth: 2,
        resolution: 8,
        clocking: 16000000,
        prescaler: 64,
      }
      this.pwms.push(signal)
      const pwm = new PWM(signal)

      this.oscilloscope.addSignal(pwm)
      this.oscilloscope.draw();
    },

    onSelect(id, event) {
      const activeSignals = [...event.srcElement.selectedOptions].map(
        option => this.signals.find(s => s.id === parseInt(option.value))
      )
      const vueSignal = this.signals.find(s => s.id === id)
      const oscSignal = this.oscilloscope.signals.find(s => s.id === id)

      vueSignal.signals = activeSignals
      oscSignal.state.signals = this.oscilloscope.signals.filter(s => {
        return !!activeSignals.find(as => s.id === as.id)
      })
      this.oscilloscope.draw();
    },

    onSelectPWMSignal(id, event) {
      const activeSignals = [...event.srcElement.selectedOptions].map(
        option => this.signals.find(s => s.id === parseInt(option.value))
      )
      const datas = activeSignals[0] ? activeSignals[0] : null
      if (!datas) return
      
      const pwm = this.oscilloscope.signals.find(s => s.id === id)
      const signal = this.oscilloscope.signals.find(s => s.id === datas.id)

      pwm.signal = signal;
      this.oscilloscope.draw();
    },

    onCreateSignal(mode) {
      var f;
      switch(mode) {
        case 'triangle': f = function(x, {freq, amp, threshold}) {
          return tri({ freq, x, amp, threshold })
        }; break;
        case 'square': f = function(x, {freq, amp, threshold}) {
          return squ({ freq, x, amp, threshold })
        }; break;
        case 'sinus': f = function(x, {freq, amp, threshold}) {
          return sin({ freq, x, amp, threshold })
        }; break;
        case 'composition': f = function(x, {signals}) {
          return signals.reduce((acc, signal) => acc + signal.getAt(x), 0) / signals.length
        }; break;
      }

      this.popin = false;
      const signal = {
        mode,
        id: id++,
        freq: 440,
        amp: 1,
        visible: true,
        color: '#000000',
        signals: [],
        pwms: [],
        threshold: 0.5,
      }

      this.signals.push(signal)
      this.oscilloscope.addSignal(new Signal({
        id: signal.id,
        f,
        state: { ...signal },
        color: signal.color,
        visible: signal.visible,
      }))

      this.oscilloscope.draw();
    },

    onChangeSignal(index) {
      const datas = this.signals[index]
      const signal = this.oscilloscope.signals.find(signal => signal.id === datas.id);

      signal.state.freq = datas.freq
      signal.state.amp = datas.amp
      signal.visible = datas.visible
      signal.color = datas.color
      signal.threshold = datas.threshold
      this.oscilloscope.draw();
    },

    onChangePWM(index) {
      const datas = this.pwms[index]
      const signal = this.oscilloscope.signals.find(signal => signal.id === datas.id);
      
      signal.clocking = datas.clocking
      signal.resolution = datas.resolution
      signal.prescaler = datas.prescaler
      signal.color = datas.color
      signal.lineWidth = datas.lineWidth


      this.infos = [
        { name: "pwm max frequency", value: signal.freq }
      ]

      this.oscilloscope.draw();
    },

    onMouseDown(event) {
      this.start = {
        mouse: {x: event.clientX, y: event.clientY},
        screen: {...this.oscilloscope.screen.root}
      }

      this.$refs.canvas.addEventListener('mousemove', this.onMouseMove)
      this.$refs.canvas.addEventListener('mouseup', this.onMouseUp)
    },

    onMouseMove(event) {
      const { root, pixelsUnit } = this.oscilloscope.screen
      const { clientX, clientY } = event
      
      root.x = this.start.screen.x - (clientX - this.start.mouse.x) * 2 / pixelsUnit.x
      root.y = this.start.screen.y - (clientY - this.start.mouse.y) * -2 / pixelsUnit.y
      
      this.oscilloscope.draw()
    },

    onMouseUp() {
      this.$refs.canvas.removeEventListener('mousemove', this.onMouseMove)
    },
  }
}
</script>

<style lang="sass">
#home
  touch-action: pan-x pan-y pinch-zoom

details
  margin-bottom: 20px
  display: block

summary
  text-align: left
  border-bottom: 2px solid white
  padding-bottom: 5px
  text-transform: uppercase
  letter-spacing: 5px
  font-size: 0.8rem
  font-weight: bold

button
  display: block
  width: 100%
  background-color: white
  border-radius: 100px
  margin-top: 10px
  padding: 5px

.signal
  border-bottom: 1px solid grey
  padding: 15px 0

.gui
  position: absolute
  top: 0
  left: 0
  height: 100vh
  background: white
  border-right: 1px solid black
  padding: 15px
  box-sizing: content-box
  width: 200px
  overflow: scroll

.canvas
  width: 100%
  height: 100%

.param
  padding: 5px 0
  font-size: 10px
  display: flex
  justify-content: space-between

  &__label
    display: block
    text-align: left
    text-transform: uppercase
    font-weight: bold
    margin-bottom: 0
    display: flex
    flex-direction: column
    justify-content: center
    margin-right: 10px
    flex: 1
    max-width: 30%

  &__input
    display: block
    border-radius: 0
    border: 1px solid black
    padding: 2px 10px
    box-sizing: border-box
    width: 100%
    height: 20px
    flex: 1

    &[type="color"]
      padding: 0
    
    
</style>
