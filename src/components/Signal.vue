<template>
  <div class="signal">
    <div class="param">
      <label for="pFreq" class="param__label">Frequency (Hz)</label>
      <input id="pFreq" class="param__input" type="number" min="0.1" max="22000" step="0.01" value="1" @input="onChangeFrequency">
    </div>
    
    <div class="param">
      <label for="pAmp" class="param__label">Amplitude (V)</label>
      <input id="pAmp" class="param__input" type="number" min="0" max="22000" step="1" value="1" @input="onChangeAmp">
    </div>
  </div>
</template>
