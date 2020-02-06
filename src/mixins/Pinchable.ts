const pinchableMixin: any = {
  mounted() {
    this.positionX = 0;
    this.positionY = 0;

    this.zoom = this.zoom ? this.zoom : 1;
    this.zoomInterval = this.zoomInterval
      ? this.zoomInterval
      : [1, 1000000];

    this.xInterval = this.xInterval
      ? this.xInterval
      : [-Infinity, Infinity];

    this.yInterval = this.yInterval
      ? this.yInterval
      : [-Infinity, Infinity];

    this.$el.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        this.zoom -= event.deltaY;
        this.zoom = Math.min(Math.max(this.zoomInterval[0], this.zoom), this.zoomInterval[1]);
      } else {
        this.positionX += event.deltaX * 0.5;
        this.positionY += event.deltaY * 0.5;

        this.positionX = Math.min(Math.max(this.xInterval[0], this.positionX), this.xInterval[1]);
        this.positionY = Math.min(Math.max(this.yInterval[0], this.positionY), this.yInterval[1]);
      }

      this.$emit('zoom');
    });

    window.addEventListener('gesturestart', (event) => event.preventDefault());
    window.addEventListener('gesturechange', (event) => event.preventDefault());
    window.addEventListener('gestureend', (event) => event.preventDefault());
  },
};

export default pinchableMixin;
