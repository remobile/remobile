cordova.define("com.dooble.phonertc.PhoneRTCProxy", function(require, exports, module) {
  var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
  var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
  var MediaStream = window.webkitMediaStream || window.mozMediaStream || window.MediaStream;

  navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

  var localStreams = [];
  var localVideoTrack, localAudioTrack;

  function Session(sessionKey, config, sendMessageCallback) {
    var self = this;
    self.sessionKey = sessionKey;
    self.config = config;
    self.sendMessage = sendMessageCallback;

    self.onIceCandidate = function (event) {
      if (event.candidate) {
        self.sendMessage({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        });
      }
    };

    self.onRemoteStreamAdded = function (event) {
      self.mediaView = addRemoteStream(event.stream, self.config.streams.video);
      self.sendMessage({ type: '__answered' });
    };

    self.setRemote = function (message) {
      var setRemote = function() {
        message.sdp = self.addCodecParam(message.sdp, 'opus/48000', 'stereo=1');
        self.peerConnection.setRemoteDescription(new SessionDescription(message), function () {
          console.log('setRemote success');
        }, function (error) {
          console.log(error);
        });
      };
      async.until(
          function(){return !!self.peerConnection},
          function(cb) {setTimeout(cb, 100)},
          setRemote
      );
    };

    // Adds fmtp param to specified codec in SDP.
    self.addCodecParam = function (sdp, codec, param) {
      var sdpLines = sdp.split('\r\n');

      // Find opus payload.
      var index = self.findLine(sdpLines, 'a=rtpmap', codec);
      var payload;
      if (index) {
        payload = self.getCodecPayloadType(sdpLines[index]);
      }

      // Find the payload in fmtp line.
      var fmtpLineIndex = self.findLine(sdpLines, 'a=fmtp:' + payload.toString());
      if (fmtpLineIndex === null) {
        return sdp;
      }

      sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat('; ', param);

      sdp = sdpLines.join('\r\n');
      return sdp;
    };

    // Find the line in sdpLines that starts with |prefix|, and, if specified,
    // contains |substr| (case-insensitive search).
    self.findLine = function (sdpLines, prefix, substr) {
      return self.findLineInRange(sdpLines, 0, -1, prefix, substr);
    };

    // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
    // and, if specified, contains |substr| (case-insensitive search).
    self.findLineInRange = function (sdpLines, startLine, endLine, prefix, substr) {
      var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
      for (var i = startLine; i < realEndLine; ++i) {
        if (sdpLines[i].indexOf(prefix) === 0) {
          if (!substr ||
              sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
            return i;
          }
        }
      }
      return null;
    };

    // Gets the codec payload type from an a=rtpmap:X line.
    self.getCodecPayloadType = function (sdpLine) {
      var pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
      var result = sdpLine.match(pattern);
      return (result && result.length === 2) ? result[1] : null;
    };

    // Returns a new m= line with the specified codec as the first one.
    self.setDefaultCodec = function (mLine, payload) {
      var elements = mLine.split(' ');
      var newLine = [];
      var index = 0;
      for (var i = 0; i < elements.length; i++) {
        if (index === 3) { // Format of media starts from the fourth.
          newLine[index++] = payload; // Put target payload to the first.
        }
        if (elements[i] !== payload) {
          newLine[index++] = elements[i];
        }
      }
      return newLine.join(' ');
    };
  }

  Session.prototype.createOrUpdateStream = function () {
    if (this.localStream) {
      this.peerConnection.removeStream(this.localStream);
    }

    this.localStream = new MediaStream();

    if (this.config.streams.audio) {
      this.localStream.addTrack(localAudioTrack);
    }

    if (this.config.streams.video) {
      this.localStream.addTrack(localVideoTrack);
    }

    this.peerConnection.addStream(this.localStream);
  };

  Session.prototype.sendOffer = function () {
    var self = this;
    self.peerConnection.createOffer(function (sdp) {
      self.peerConnection.setLocalDescription(sdp, function () {
        console.log('Set session description success.');
      }, function (error) {
        console.log(error);
      });

      self.sendMessage(sdp);
    }, function (error) {
      console.log(error);
    }, { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: self.config.streams.video }});
  };

  Session.prototype.sendAnswer = function () {
    var self = this;
    var sendAnswer = function() {
      self.peerConnection.createAnswer(function (sdp) {
        self.peerConnection.setLocalDescription(sdp, function () {
          console.log('Set session description success.');
        }, function (error) {
          console.log(error);
        });

        self.sendMessage(sdp);
      }, function (error) {
        console.log(error);
      }, {mandatory: {OfferToReceiveAudio: true, OfferToReceiveVideo: self.config.streams.video}});
    };
    async.until(
        function(){return !!self.peerConnection},
        function(cb) {setTimeout(cb, 100)},
        sendAnswer
    );
  };
  Session.prototype.addCandidate = function (message) {
    var self = this;
    var addCandidate = function() {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      });

      self.peerConnection.addIceCandidate(candidate, function () {
        console.log('Remote candidate added successfully.');
      }, function (error) {
        console.log(error);
      });
    };
    async.until(
        function(){return !!self.peerConnection},
        function(cb) {setTimeout(cb, 100)},
        addCandidate
    );
  };

  Session.prototype.call = function () {
    var self = this;

    function call() {
      // create the peer connection
      self.peerConnection = new PeerConnection({
        iceServers: [
          {
            url: 'stun:stun.l.google.com:19302'
          },
          {
            url: self.config.turn.host,
            username: self.config.turn.username,
            password: self.config.turn.password
          }
        ]
      }, { optional: [ { DtlsSrtpKeyAgreement: true } ]});

      self.peerConnection.onicecandidate = self.onIceCandidate;
      self.peerConnection.onaddstream = self.onRemoteStreamAdded;

      // attach the stream to the peer connection
      self.createOrUpdateStream.call(self);

      // if initiator - create offer
      if (self.config.isInitiator) {
        self.sendOffer.call(self);
      }
    }

    var missingStreams = {
      video: self.config.streams.video && !localVideoTrack,
      audio: self.config.streams.audio && !localAudioTrack
    };

    if (missingStreams.audio || missingStreams.video) {
      navigator.getUserMedia(missingStreams, function (stream) {
        localStreams.push(stream);

        if (missingStreams.audio) {
          console.log('missing audio stream; retrieving');
          localAudioTrack = stream.getAudioTracks()[0];
        }

        if (missingStreams.video) {
          console.log('missing video stream; retrieving');
          localVideoTrack = stream.getVideoTracks()[0];
        }

        call();
      }, function (error) {
        console.log(error);
      });
    } else {
      call();
    }
  };

  Session.prototype.receiveMessage = function (message) {
    var self = this;
    if (message.type === 'offer') {
      self.setRemote(message);
      self.sendAnswer.call(self);
    } else if (message.type === 'answer') {
      self.setRemote(message);
    } else if (message.type === 'candidate') {
      self.addCandidate(message);
    } else if (message.type === 'bye') {
      this.disconnect(false);
    }
  };

  Session.prototype.renegotiate = function () {
    if (this.config.isInitiator) {
      this.sendOffer();
    } else {
      this.sendAnswer();
    }
  };

  Session.prototype.disconnect = function (sendByeMessage) {
    if (this.mediaView) {
      removeRemoteStream(this.mediaView, this.config.streams.video);
    }

    if (sendByeMessage) {
      this.sendMessage({ type: 'bye' });
    }

    this.peerConnection.close();
    this.peerConnection = null;

    this.sendMessage({ type: '__disconnected' });

    onSessionDisconnect(this.sessionKey);
  };


  var sessions = {};
  var videoConfig;
  var localVideoView;
  var remoteViews = [];

  module.exports = {
    createSessionObject: function (success, error, options) {
      var sessionKey = options[0];
      var session = new Session(sessionKey, options[1], success);

      session.sendMessage({
        type: '__set_session_key',
        sessionKey: sessionKey
      });

      sessions[sessionKey] = session;
    },
    call: function (success, error, options) {
      sessions[options[0].sessionKey].call();
    },
    receiveMessage: function (success, error, options) {
      sessions[options[0].sessionKey]
          .receiveMessage(JSON.parse(options[0].message));
    },
    renegotiate: function (success, error, options) {
      console.log('Renegotiation is currently only supported in iOS and Android.')
      // var session = sessions[options[0].sessionKey];
      // session.config = options[0].config;
      // session.createOrUpdateStream();
      // session.renegotiate();
    },
    disconnect: function (success, error, options) {
      var session = sessions[options[0].sessionKey];
      if (session) {
        session.disconnect(true);
      }
    },
    setVideoView: function (success, error, options) {
      videoConfig = options[0];
      if (!localVideoView) {
        localVideoView = document.createElement('video');
        localVideoView.autoplay = true;
        localVideoView.muted = true;
        localVideoView.style.position = 'absolute';
        localVideoView.style.zIndex = 999;
        localVideoView.addEventListener("loadedmetadata", scaleToFill);

        refreshLocalVideoView();

        if (!localVideoTrack) {
          navigator.getUserMedia({audio: false, video: true}, function (stream) {
            localStreams.push(stream);
            localAudioTrack = stream.getAudioTracks()[0];
            localVideoTrack = stream.getVideoTracks()[0];
            localVideoView.src = URL.createObjectURL(stream);
            localVideoView.load();
          }, function (error) {
            console.log(error);
          });
        } else {
          var stream = new MediaStream();
          stream.addTrack(localVideoTrack);
          localVideoView.src = URL.createObjectURL(stream);
          localVideoView.load();
        }

        document.body.appendChild(localVideoView);
      } else {
        refreshLocalVideoView();
        refreshRemoteVideoViews();
      }
    },
    hideVideoView: function (success, error, options) {
      localVideoView.style.display = 'none';
      remoteViews.forEach(function (view) {
        view.style.display = 'none';
      });
    },
    showVideoView: function (success, error, options) {
      localVideoView.style.display = '';
      remoteViews.forEach(function (view) {
        view.style.display = '';
      });
    },
    removeLocalVideoView: removeLocalVideoView
  };

  function addRemoteStream(stream, video) {
    var view;
    if (video) {
      var videoView = document.createElement('video');
      videoView.autoplay = true;
      videoView.addEventListener("loadedmetadata", scaleToFill);
      videoView.style.position = 'absolute';
      videoView.style.zIndex = 998;

      videoView.src = URL.createObjectURL(stream);
      videoView.load();

      remoteViews.push(videoView);
      document.body.appendChild(videoView);
      refreshRemoteVideoViews();
      view = videoView;
    } else {
      var audioView = document.createElement('audio');
      audioView.autoplay = true;
      audioView.style.display = 'none';
      audioView.src = URL.createObjectURL(stream);
      audioView.load();
      remoteViews.push(audioView);
      document.body.appendChild(audioView);
      view = audioView;
    }
    return view;
  }

  function removeRemoteStream(view, video) {
    //console.log(remoteViews);
    document.body.removeChild(view);
    remoteViews.splice(view, 1);
    console.log(remoteViews);
    if (video) {
      refreshRemoteVideoViews();
    }
  }

  function getCenter(videoCount, videoSize, containerSize) {
    return Math.round((containerSize - videoSize * videoCount) / 2);
  }

  function refreshRemoteVideoViews() {
    var layout = videoConfig.remoteRegion;
    var n = remoteViews.length;

    if (n === 0) {
      return;
    }

    var rows = n < 9 ? 2 : 3;
    var videosInRow = n === 2 ? 2 : Math.ceil(n/rows);

    var videoSize = layout.size.width / videosInRow;
    var actualRows = Math.ceil(n / videosInRow);

    var y = getCenter(actualRows,videoSize,layout.size.height) + layout.position.y;

    var videoViewIndex = 0;

    for (var row = 0; row < rows && videoViewIndex < n; row++) {
      var x = layout.position.x + getCenter(row < rows - 1 || n % rows === 0 ? videosInRow : n - (Math.min(n, videoViewIndex + videosInRow) - 1), videoSize, layout.size.width);

      for (var video = 0; video < videosInRow && videoViewIndex < n; video++) {
        var videoView = remoteViews[videoViewIndex++];
        videoView.style.width = videoSize + 'px';
        videoView.style.height = videoSize + 'px';

        videoView.style.left = x + 'px';
        videoView.style.top = y + 'px';

        x += videoSize;
      }
      y += videoSize;
    }
  }

  function refreshLocalVideoView() {
    var layout = videoConfig.localRegion;
    localVideoView.style.width = layout.size.width + 'px';
    localVideoView.style.height = layout.size.height + 'px';
    localVideoView.style.left = layout.position.x + 'px';
    localVideoView.style.top = layout.position.y + 'px';
  }

  function scaleToFill(event) {
    return; //fang modify no use scale
    var element = this;
    var targetRatio = element.offsetWidth / element.offsetHeight;
    var lastScaleType, lastAdjustmentRatio;

    function refreshTransform () {
      var widthIsLargerThanHeight = element.videoWidth > element.videoHeight;
      var actualRatio = element.videoWidth / element.videoHeight;

      var scaleType = widthIsLargerThanHeight ? 'scaleY' : 'scaleX';
      var adjustmentRatio = widthIsLargerThanHeight ?
      actualRatio / targetRatio :
      targetRatio / actualRatio ;

      if (lastScaleType !== scaleType || lastAdjustmentRatio !== adjustmentRatio) {
        var transform = scaleType + '(' + adjustmentRatio + ')';

        element.style.webkitTransform = transform;
        element.style.MozTransform = transform;
        element.style.msTransform = transform;
        element.style.OTransform = transform;
        element.style.transform = transform;

        lastScaleType = scaleType;
        lastAdjustmentRatio = adjustmentRatio;
      }

      setTimeout(refreshTransform, 100);
    }

    refreshTransform();
  }

  function onSessionDisconnect(sessionKey) {
    delete sessions[sessionKey];

    if (Object.keys(sessions).length === 0) {
      removeLocalVideoView();
    }
  }
  function removeLocalVideoView() {
    if (localVideoView) {
      document.body.removeChild(localVideoView);
      localVideoView = null;
    }

    localStreams.forEach(function (stream) {
      stream.stop();
    });

    localStreams = [];
    localVideoTrack = null;
    localAudioTrack = null;
  }

  require("cordova/exec/proxy").add("PhoneRTCPlugin", module.exports);
});
