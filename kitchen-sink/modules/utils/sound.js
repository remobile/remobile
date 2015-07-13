module.exports = (function() {
    "use strict";
    function Sound() {
    }

    Sound.prototype.playSound = function(src) {
        if (app.setting.notPlaySound||app.device.pause) {
            return;
        }
        if (this.audio_sound) {
            this.audio_sound.stop();
            this.audio_sound.release();
            this.audio_sound = null;
        }
        this.audio_sound = new Media((app.device.os==='desktop'||navigator.app.target==='web')?src:app.resPath+src);
        this.audio_sound.play();
    };
    Sound.prototype.stopRing = function() {
        if (this.audio_ring) {
            this.ring_state = 0;
            this.audio_ring.stop();
            this.audio_ring.release();
            this.audio_ring = null;
        }
    };
    Sound.prototype.playRing = function(src) {
        console.log("playRing:" + src);
        this.ring_state = 1;
        if (app.device.os==='desktop'||navigator.app.target==='web') {
            this.audio_ring = new Media(src, 1);
        } else {
            this.audio_ring = new Media(app.resPath+src, null, null, function(status) {
                if(status==Media.MEDIA_STOPPED && this.ring_state==1) {
                    this.audio_ring.play();
                }
            });
        }
        this.audio_ring.play();
    };
    return new Sound();
})();


